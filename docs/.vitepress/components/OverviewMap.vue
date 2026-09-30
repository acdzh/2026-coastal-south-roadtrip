<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { routes } from '../data/routes'

const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
let mapInstance: any = null
let useOsm = false

function checkKey() {
  return !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  const PI = Math.PI, a = 6378245.0, ee = 0.00669342162296594323
  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) return [lng, lat]
  let dLat = -100 + 2*lng + 3*lat + 0.2*lat*lat + 0.1*lng*lat + 0.2*Math.sqrt(Math.abs(lng))
  dLat += (20*Math.sin(6*lng*PI) + 20*Math.sin(2*lng*PI)) * 2/3
  dLat += (20*Math.sin(lat*PI) + 40*Math.sin(lat/3*PI)) * 2/3
  dLat += (160*Math.sin(lat/12*PI) + 320*Math.sin(lat*PI/30)) * 2/3
  let dLng = 300 + lng + 2*lat + 0.1*lng*lng + 0.1*lng*lat + 0.1*Math.sqrt(Math.abs(lng))
  dLng += (20*Math.sin(6*lng*PI) + 20*Math.sin(2*lng*PI)) * 2/3
  dLng += (20*Math.sin(lng*PI) + 40*Math.sin(lng/3*PI)) * 2/3
  dLng += (150*Math.sin(lng/12*PI) + 300*Math.sin(lng/30*PI)) * 2/3
  const rlat = (lat - 35) / 180 * PI
  let magic = Math.sin(rlat); magic = 1 - ee * magic * magic
  const sq = Math.sqrt(magic)
  dLat = (dLat * 180) / ((a * (1 - ee)) / (magic * sq) * PI)
  dLng = (dLng * 180) / (a / sq * Math.cos(rlat) * PI)
  return [lng + dLng, lat + dLat]
}

async function initAmap() {
  if (!mapContainer.value || routes.length === 0) return
  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!
  window._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({ key, version: '2.0', plugins: ['AMap.Driving'] })

    mapInstance = new AMap.Map(mapContainer.value, { zoom: 7, viewMode: '2D' })
    const allMarkers: any[] = []

    for (const route of routes) {
      const corePoints = route.points
        .filter(p => p.type === 'start' || p.type === 'end' || p.type === 'spot')
        .map(p => { const [glng, glat] = wgs84ToGcj02(p.lng, p.lat); return { ...p, glng, glat } })

      for (const p of corePoints) {
        const marker = new AMap.Marker({
          position: [p.glng, p.glat],
          title: `Day ${route.day}: ${p.name}`,
          label: { content: `D${route.day} ${p.name}`, direction: 'top' },
        })
        marker.on('click', () => { if (p.link) window.location.href = p.link })
        allMarkers.push(marker)
      }

      // Real driving route per day
      const gcjAll = route.points.map(p => {
        const [glng, glat] = wgs84ToGcj02(p.lng, p.lat)
        return { glng, glat }
      })
      if (gcjAll.length >= 2) {
        const driving = new AMap.Driving({ map: mapInstance, hideMarkers: true, strokeColor: route.color })
        const start = [gcjAll[0].glng, gcjAll[0].glat]
        const end = [gcjAll[gcjAll.length - 1].glng, gcjAll[gcjAll.length - 1].glat]
        const waypoints = gcjAll.slice(1, -1).map(p => [p.glng, p.glat])
        driving.search(start, end, { waypoints }, (status: string) => {
          if (status !== 'complete') {
            mapInstance.add(new AMap.Polyline({
              path: gcjAll.map(p => [p.glng, p.glat]),
              strokeColor: route.color, strokeWeight: 3, strokeOpacity: 0.7,
            }))
          }
        })
      }
    }

    mapInstance.add(allMarkers)
    mapInstance.setFitView(allMarkers, false, [50, 50, 50, 50])
    mapReady.value = true
  } catch (e) {
    console.warn('AMap failed, falling back to OSM:', e)
    initOsm()
  }
}

async function initOsm() {
  if (!mapContainer.value || routes.length === 0) return
  useOsm = true

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  mapInstance = L.map(mapContainer.value, { scrollWheelZoom: true, attributionControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapInstance)

  const allMarkers: any[] = []

  for (const route of routes) {
    const corePoints = route.points.filter(p => p.type === 'start' || p.type === 'end' || p.type === 'spot')
    for (const p of corePoints) {
      const icon = L.divIcon({
        className: 'osm-marker',
        html: `<div style="background:${route.color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      })
      const marker = L.marker([p.lat, p.lng], { icon, title: `D${route.day} ${p.name}` }).addTo(mapInstance)
      marker.bindTooltip(`D${route.day} ${p.name}`, { direction: 'top', offset: [0, -10] })
      if (p.link) marker.on('click', () => { window.location.href = p.link! })
      allMarkers.push(marker)
    }

    // OSRM real route per day
    if (route.points.length >= 2) {
      const coords = route.points.map(p => `${p.lng},${p.lat}`).join(';')
      fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data.code === 'Ok' && data.routes?.[0]) {
            const latlngs = data.routes[0].geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]] as [number, number]
            )
            L.polyline(latlngs, { color: route.color, weight: 3, opacity: 0.8 }).addTo(mapInstance)
          }
        })
        .catch(() => {
          const latlngs = route.points.map(p => [p.lat, p.lng] as [number, number])
          L.polyline(latlngs, { color: route.color, weight: 2, opacity: 0.5, dashArray: '8,8' }).addTo(mapInstance)
        })
    }
  }

  if (allMarkers.length > 0) {
    mapInstance.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.1))
  }
  mapReady.value = true
}

function onKeyChanged() {
  if (checkKey() && useOsm && mapInstance) {
    mapInstance.remove(); mapInstance = null; useOsm = false; mapReady.value = false
    nextTick(() => initAmap())
  }
}

onMounted(async () => {
  await nextTick()
  if (checkKey()) initAmap()
  else if (routes.length > 0) initOsm()
  window.addEventListener('amap-key-changed', onKeyChanged)
})

onUnmounted(() => {
  window.removeEventListener('amap-key-changed', onKeyChanged)
  if (mapInstance) { useOsm ? mapInstance.remove() : mapInstance.destroy?.() }
})
</script>

<template>
  <div class="overview-map">
    <div v-if="routes.length > 0" ref="mapContainer" class="overview-map-container" />
    <div v-else class="overview-map-empty"><p>路线数据即将更新</p></div>
  </div>
</template>

<style scoped>
.overview-map { margin: 16px 0; border-radius: 8px; overflow: hidden; border: 1px solid var(--vp-c-divider); }
.overview-map-container { width: 100%; height: 450px; }
@media (max-width: 640px) { .overview-map-container { height: 300px; } }
.overview-map-empty { padding: 40px; text-align: center; color: var(--vp-c-text-3); background: var(--vp-c-bg-soft); }
</style>
