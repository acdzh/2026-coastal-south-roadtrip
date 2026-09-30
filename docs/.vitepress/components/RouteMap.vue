<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { routes } from '../data/routes'

const props = defineProps<{ day: number }>()

const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
let mapInstance: any = null
let useOsm = false

const dayRoute = routes.find(r => r.day === props.day)

const colorMap: Record<string, string> = {
  start: '#4CAF50', end: '#F44336', spot: '#2196F3',
  food: '#FF9800', charge: '#FFEB3B', sleep: '#9C27B0', waypoint: '#607D8B'
}

function checkKey() {
  return !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

// WGS84 → GCJ02 coordinate transform for AMap
function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  const PI = Math.PI
  const a = 6378245.0
  const ee = 0.00669342162296594323

  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) {
    return [lng, lat]
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
  return [lng + dLng, lat + dLat]
}

function transformLat(x: number, y: number): number {
  const PI = Math.PI
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLng(x: number, y: number): number {
  const PI = Math.PI
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

async function initAmap() {
  if (!mapContainer.value || !dayRoute) return
  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!
  window._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({ key, version: '2.0', plugins: ['AMap.Driving'] })

    mapInstance = new AMap.Map(mapContainer.value, { zoom: 9, viewMode: '2D' })

    const gcjPoints = dayRoute.points.map(p => {
      const [glng, glat] = wgs84ToGcj02(p.lng, p.lat)
      return { ...p, glng, glat }
    })

    const markers = gcjPoints.map(p => {
      const marker = new AMap.Marker({
        position: [p.glng, p.glat],
        title: p.name,
        label: { content: p.name, direction: 'top' },
      })
      if (p.link) {
        marker.on('click', () => { window.location.href = p.link! })
      }
      return marker
    })
    mapInstance.add(markers)

    // Use Driving plugin for real route
    if (gcjPoints.length >= 2) {
      const driving = new AMap.Driving({ map: mapInstance, hideMarkers: true })
      const start = [gcjPoints[0].glng, gcjPoints[0].glat]
      const end = [gcjPoints[gcjPoints.length - 1].glng, gcjPoints[gcjPoints.length - 1].glat]
      const waypoints = gcjPoints.slice(1, -1).map(p => [p.glng, p.glat])

      driving.search(start, end, { waypoints }, (status: string) => {
        if (status !== 'complete') {
          // Fallback to polyline if driving search fails
          const path = gcjPoints.map(p => [p.glng, p.glat])
          mapInstance.add(new AMap.Polyline({
            path, strokeColor: dayRoute.color, strokeWeight: 4, strokeOpacity: 0.8,
          }))
        }
      })
    }

    mapInstance.setFitView(markers, false, [50, 50, 50, 50])
    mapReady.value = true
  } catch (e) {
    console.warn('AMap failed, falling back to OSM:', e)
    initOsm()
  }
}

async function initOsm() {
  if (!mapContainer.value || !dayRoute || dayRoute.points.length === 0) return
  useOsm = true

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  mapInstance = L.map(mapContainer.value, { scrollWheelZoom: true, attributionControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapInstance)

  const markers: any[] = []
  dayRoute.points.forEach(p => {
    const icon = L.divIcon({
      className: 'osm-marker',
      html: `<div style="background:${colorMap[p.type] || '#607D8B'};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    const marker = L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(mapInstance)
    marker.bindTooltip(p.name, { direction: 'top', offset: [0, -10] })
    if (p.link) {
      marker.on('click', () => { window.location.href = p.link! })
    }
    markers.push(marker)
  })

  // OSRM for real driving route
  const coords = dayRoute.points.map(p => `${p.lng},${p.lat}`).join(';')
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
    const data = await res.json()
    if (data.code === 'Ok' && data.routes?.[0]) {
      const routeCoords = data.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      )
      L.polyline(routeCoords, { color: dayRoute.color, weight: 4, opacity: 0.8 }).addTo(mapInstance)
    } else {
      throw new Error('OSRM routing failed')
    }
  } catch {
    const latlngs = dayRoute.points.map(p => [p.lat, p.lng] as [number, number])
    L.polyline(latlngs, { color: dayRoute.color, weight: 3, opacity: 0.6, dashArray: '8,8' }).addTo(mapInstance)
  }

  const group = L.featureGroup(markers)
  mapInstance.fitBounds(group.getBounds().pad(0.15))
  mapReady.value = true
}

function onKeyChanged() {
  if (checkKey() && useOsm && mapInstance) {
    mapInstance.remove()
    mapInstance = null
    useOsm = false
    mapReady.value = false
    nextTick(() => initAmap())
  }
}

onMounted(async () => {
  await nextTick()
  if (checkKey()) {
    initAmap()
  } else if (dayRoute && dayRoute.points.length > 0) {
    initOsm()
  }
  window.addEventListener('amap-key-changed', onKeyChanged)
})

onUnmounted(() => {
  window.removeEventListener('amap-key-changed', onKeyChanged)
  if (mapInstance) {
    if (useOsm) mapInstance.remove()
    else if (mapInstance.destroy) mapInstance.destroy()
  }
})
</script>

<template>
  <div class="route-map">
    <div v-if="!dayRoute" class="route-map-empty">
      <p>暂无 Day {{ day }} 的路线数据</p>
    </div>
    <div v-else ref="mapContainer" class="route-map-container" />
  </div>
</template>

<style scoped>
.route-map {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.route-map-container {
  width: 100%;
  height: 400px;
}
@media (max-width: 640px) {
  .route-map-container {
    height: 250px;
  }
}
.route-map-empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
}
</style>
