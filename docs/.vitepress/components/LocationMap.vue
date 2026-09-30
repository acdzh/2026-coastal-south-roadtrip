<script setup lang="ts">
/**
 * LocationMap - 显示单个地点的小地图
 * 用在 SpotCard 旁边或景点描述处，标注"这个地方在哪"
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  lat: number
  lng: number
  name?: string
  zoom?: number
}>(), {
  name: '',
  zoom: 14,
})

const mapContainer = ref<HTMLElement>()
const hasAmapKey = ref(false)
let mapInstance: any = null
let useOsm = false

function checkKey() {
  hasAmapKey.value = !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

async function initAmap() {
  if (!mapContainer.value) return
  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!
  window._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({ key, version: '2.0' })

    mapInstance = new AMap.Map(mapContainer.value, {
      zoom: props.zoom,
      center: [props.lng, props.lat],
      viewMode: '2D',
    })

    const marker = new AMap.Marker({
      position: [props.lng, props.lat],
      title: props.name,
    })
    if (props.name) {
      marker.setLabel({ content: props.name, direction: 'top' })
    }
    mapInstance.add(marker)
  } catch {
    initOsm()
  }
}

async function initOsm() {
  if (!mapContainer.value) return
  useOsm = true

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  mapInstance = L.map(mapContainer.value, {
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: true,
    attributionControl: false,
  }).setView([props.lat, props.lng], props.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(mapInstance)

  const icon = L.divIcon({
    className: 'loc-marker',
    html: '<div style="background:#F44336;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
  const marker = L.marker([props.lat, props.lng], { icon }).addTo(mapInstance)
  if (props.name) {
    marker.bindTooltip(props.name, { permanent: true, direction: 'top', offset: [0, -12] })
  }
}

onMounted(async () => {
  checkKey()
  await nextTick()
  if (hasAmapKey.value) {
    initAmap()
  } else {
    initOsm()
  }
})

onUnmounted(() => {
  if (mapInstance) {
    if (useOsm) mapInstance.remove()
    else if (mapInstance.destroy) mapInstance.destroy()
  }
})
</script>

<template>
  <div class="location-map">
    <div ref="mapContainer" class="location-map-container" />
  </div>
</template>

<style scoped>
.location-map {
  margin: 8px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.location-map-container {
  width: 100%;
  height: 200px;
}
@media (max-width: 640px) {
  .location-map-container {
    height: 160px;
  }
}
</style>
