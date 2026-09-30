<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { routes, type RoutePoint } from '../data/routes'

const props = defineProps<{ day: number }>()

const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
const hasAmapKey = ref(false)
const useOsm = ref(false)
let mapInstance: any = null

const dayRoute = routes.find(r => r.day === props.day)

const colorMap: Record<string, string> = {
  start: '#4CAF50', end: '#F44336', spot: '#2196F3',
  food: '#FF9800', charge: '#FFEB3B', sleep: '#9C27B0', waypoint: '#607D8B'
}

function checkKey() {
  hasAmapKey.value = !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
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

    const markers = dayRoute.points.map(p => new AMap.Marker({
      position: [p.lng, p.lat],
      title: p.name,
      label: { content: p.name, direction: 'top' },
    }))
    mapInstance.add(markers)
    mapInstance.setFitView(markers, false, [50, 50, 50, 50])
    mapReady.value = true
  } catch (e) {
    console.warn('AMap load failed, falling back to OSM:', e)
    initOsm()
  }
}

async function initOsm() {
  if (!mapContainer.value || !dayRoute || dayRoute.points.length === 0) return
  useOsm.value = true

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

  const latlngs = dayRoute.points.map(p => [p.lat, p.lng] as [number, number])
  L.polyline(latlngs, { color: dayRoute.color, weight: 3, opacity: 0.8 }).addTo(mapInstance)

  const group = L.featureGroup(markers)
  mapInstance.fitBounds(group.getBounds().pad(0.15))
  mapReady.value = true
}

function onKeyChanged() {
  checkKey()
  if (hasAmapKey.value && mapInstance) {
    if (useOsm.value) {
      mapInstance.remove()
      mapInstance = null
      useOsm.value = false
      mapReady.value = false
      nextTick(() => initAmap())
    }
  }
}

onMounted(async () => {
  checkKey()
  await nextTick()
  if (hasAmapKey.value) {
    initAmap()
  } else if (dayRoute && dayRoute.points.length > 0) {
    initOsm()
  }
  window.addEventListener('amap-key-changed', onKeyChanged)
})

onUnmounted(() => {
  window.removeEventListener('amap-key-changed', onKeyChanged)
  if (mapInstance) {
    if (useOsm.value) {
      mapInstance.remove()
    } else if (mapInstance.destroy) {
      mapInstance.destroy()
    }
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
