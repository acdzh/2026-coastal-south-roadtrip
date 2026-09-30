<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { routes } from '../data/routes'

const mapContainer = ref<HTMLElement>()
const hasAmapKey = ref(false)
const useOsm = ref(false)
const mapReady = ref(false)
let mapInstance: any = null

const dayColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#607D8B', '#795548']

function checkKey() {
  hasAmapKey.value = !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

async function initAmap() {
  if (!mapContainer.value || routes.length === 0) return
  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!
  window._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({ key, version: '2.0' })

    mapInstance = new AMap.Map(mapContainer.value, { zoom: 7, viewMode: '2D' })
    const allMarkers: any[] = []

    for (const route of routes) {
      const corePoints = route.points.filter(p => p.type === 'start' || p.type === 'end' || p.type === 'spot')
      for (const p of corePoints) {
        const marker = new AMap.Marker({
          position: [p.lng, p.lat],
          title: `Day ${route.day}: ${p.name}`,
          label: { content: `D${route.day} ${p.name}`, direction: 'top' },
        })
        marker.on('click', () => { if (p.link) window.location.href = p.link })
        allMarkers.push(marker)
      }

      if (route.points.length >= 2) {
        const path = route.points.map(p => [p.lng, p.lat])
        mapInstance.add(new AMap.Polyline({
          path, strokeColor: route.color, strokeWeight: 4, strokeOpacity: 0.8,
        }))
      }
    }

    mapInstance.add(allMarkers)
    mapInstance.setFitView(allMarkers, false, [50, 50, 50, 50])
    mapReady.value = true
  } catch (e) {
    console.warn('AMap load failed, falling back to OSM:', e)
    initOsm()
  }
}

async function initOsm() {
  if (!mapContainer.value || routes.length === 0) return
  useOsm.value = true

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
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      const marker = L.marker([p.lat, p.lng], { icon, title: `D${route.day} ${p.name}` }).addTo(mapInstance)
      marker.bindTooltip(`D${route.day} ${p.name}`, { direction: 'top', offset: [0, -10] })
      if (p.link) {
        marker.on('click', () => { window.location.href = p.link! })
      }
      allMarkers.push(marker)
    }

    if (route.points.length >= 2) {
      const latlngs = route.points.map(p => [p.lat, p.lng] as [number, number])
      L.polyline(latlngs, { color: route.color, weight: 3, opacity: 0.8 }).addTo(mapInstance)
    }
  }

  if (allMarkers.length > 0) {
    const group = L.featureGroup(allMarkers)
    mapInstance.fitBounds(group.getBounds().pad(0.1))
  }
  mapReady.value = true
}

function onKeyChanged() {
  checkKey()
  if (hasAmapKey.value && useOsm.value && mapInstance) {
    mapInstance.remove()
    mapInstance = null
    useOsm.value = false
    mapReady.value = false
    nextTick(() => initAmap())
  }
}

onMounted(async () => {
  checkKey()
  await nextTick()
  if (hasAmapKey.value) {
    initAmap()
  } else if (routes.length > 0) {
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
  <div class="overview-map">
    <div v-if="routes.length > 0" ref="mapContainer" class="overview-map-container" />
    <div v-else class="overview-map-empty">
      <p>路线数据即将更新</p>
    </div>
  </div>
</template>

<style scoped>
.overview-map {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.overview-map-container {
  width: 100%;
  height: 450px;
}
@media (max-width: 640px) {
  .overview-map-container {
    height: 300px;
  }
}
.overview-map-empty {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
}
</style>
