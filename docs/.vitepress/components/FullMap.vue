<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { routes } from '../data/routes'
import { chargingStations, type ChargingStation } from '../data/charging-data'
import { serviceAreas, type ServiceArea } from '../data/service-area-data'

const props = withDefaults(defineProps<{
  type: 'charging' | 'service-area'
  height?: number
}>(), {
  height: 600
})

const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
const selectedDay = ref(0) // 0 = all
let mapInstance: any = null
let useOsm = false
let markersLayer: any = null

const days = [0, 1, 2, 3, 4, 5, 6, 7]

const filteredData = computed(() => {
  if (props.type === 'charging') {
    if (selectedDay.value === 0) {
      return chargingStations
    }
    return chargingStations.filter(s => s.day === selectedDay.value)
  } else {
    if (selectedDay.value === 0) {
      return serviceAreas
    }
    return serviceAreas.filter(s => s.day === selectedDay.value)
  }
})

const stats = computed(() => {
  const data = filteredData.value
  if (props.type === 'charging') {
    const stations = data as ChargingStation[]
    return {
      total: stations.length,
      city: stations.filter(s => s.type === 'city').length,
      highway_exit: stations.filter(s => s.type === 'highway_exit').length,
      service_area: stations.filter(s => s.type === 'service_area').length,
    }
  } else {
    const areas = data as ServiceArea[]
    return {
      total: areas.length,
      hasCharging: areas.filter(a => a.hasCharging).length,
      noCharging: areas.filter(a => !a.hasCharging).length,
    }
  }
})

function checkKey() {
  return !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

// WGS84 -> GCJ02 coordinate transform for AMap
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

function getChargingColor(type: string): string {
  switch (type) {
    case 'city': return '#2196F3'
    case 'highway_exit': return '#4CAF50'
    case 'service_area': return '#FF9800'
    default: return '#607D8B'
  }
}

function getServiceAreaColor(hasCharging: boolean): string {
  return hasCharging ? '#4CAF50' : '#9E9E9E'
}

function buildPopupContent(item: ChargingStation | ServiceArea): string {
  if (props.type === 'charging') {
    const s = item as ChargingStation
    const typeLabel = s.type === 'city' ? '城区' : s.type === 'highway_exit' ? '高速出口' : '服务区'
    let html = `<div style="min-width:200px;font-size:13px;line-height:1.6">
      <strong style="font-size:14px">${s.name}</strong><br/>
      <span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:11px;color:#fff;background:${getChargingColor(s.type)}">${typeLabel}</span>
      <span style="margin-left:4px;color:#666">${s.brand}</span><br/>
      <span style="color:#666">${s.address}</span>`
    if (s.phone) {
      html += `<br/><a href="tel:${s.phone}" style="color:#2196F3">${s.phone}</a>`
    }
    if (s.near) {
      html += `<br/><span style="color:#999">附近: ${s.near}</span>`
    }
    html += `</div>`
    return html
  } else {
    const a = item as ServiceArea
    let html = `<div style="min-width:200px;font-size:13px;line-height:1.6">
      <strong style="font-size:14px">${a.name}</strong><br/>
      <span style="color:#666">${a.highway} | ${a.city}</span><br/>
      <span style="color:#666">${a.address}</span>`
    if (a.phone) {
      html += `<br/><a href="tel:${a.phone}" style="color:#2196F3">${a.phone}</a>`
    }
    if (a.hasCharging) {
      html += `<br/><span style="color:#4CAF50">有充电桩: ${a.chargingBrands.join('、')}</span>`
    } else {
      html += `<br/><span style="color:#999">无充电桩</span>`
    }
    if (a.features.length > 0) {
      html += `<br/><span style="color:#FF9800">${a.features.join(' | ')}</span>`
    }
    html += `</div>`
    return html
  }
}

async function initOsm() {
  if (!mapContainer.value) {
    return
  }
  useOsm = true

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  mapInstance = L.map(mapContainer.value, { scrollWheelZoom: true, attributionControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapInstance)

  // Draw route polylines
  for (const route of routes) {
    const coords = route.points.map(p => `${p.lng},${p.lat}`).join(';')
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
      const data = await res.json()
      if (data.code === 'Ok' && data.routes?.[0]) {
        const routeCoords = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] as [number, number]
        )
        L.polyline(routeCoords, { color: route.color, weight: 3, opacity: 0.6 }).addTo(mapInstance)
      } else {
        throw new Error('OSRM failed')
      }
    } catch {
      const latlngs = route.points.map(p => [p.lat, p.lng] as [number, number])
      L.polyline(latlngs, { color: route.color, weight: 2, opacity: 0.4, dashArray: '8,8' }).addTo(mapInstance)
    }
  }

  // Create markers layer group
  markersLayer = L.layerGroup().addTo(mapInstance)
  updateMarkers()
  mapReady.value = true
}

function updateMarkers() {
  if (!mapInstance || !useOsm) {
    return
  }

  const L = (window as any).L
  if (!L) {
    return
  }

  markersLayer.clearLayers()

  const data = filteredData.value
  const markers: any[] = []

  for (const item of data) {
    const color = props.type === 'charging'
      ? getChargingColor((item as ChargingStation).type)
      : getServiceAreaColor((item as ServiceArea).hasCharging)

    const size = props.type === 'charging' ? 10 : 12
    const icon = L.divIcon({
      className: 'fullmap-marker',
      html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
      iconSize: [size + 4, size + 4],
      iconAnchor: [(size + 4) / 2, (size + 4) / 2],
    })

    const marker = L.marker([item.lat, item.lng], { icon })
    marker.bindPopup(buildPopupContent(item), { maxWidth: 280 })
    marker.bindTooltip(item.name, { direction: 'top', offset: [0, -8] })
    markers.push(marker)
    markersLayer.addLayer(marker)
  }

  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    mapInstance.fitBounds(group.getBounds().pad(0.1))
  }
}

async function initAmap() {
  if (!mapContainer.value) {
    return
  }
  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!
  ;(window as any)._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({ key, version: '2.0' })

    mapInstance = new AMap.Map(mapContainer.value, { zoom: 7, viewMode: '2D' })

    // Draw route polylines
    for (const route of routes) {
      const path = route.points.map(p => {
        const [glng, glat] = wgs84ToGcj02(p.lng, p.lat)
        return [glng, glat]
      })
      mapInstance.add(new AMap.Polyline({
        path,
        strokeColor: route.color,
        strokeWeight: 3,
        strokeOpacity: 0.6,
      }))
    }

    updateAmapMarkers()
    mapReady.value = true
  } catch (e) {
    console.warn('AMap failed, falling back to OSM:', e)
    initOsm()
  }
}

function updateAmapMarkers() {
  if (!mapInstance || useOsm) {
    return
  }

  // Remove old markers
  if (markersLayer) {
    mapInstance.remove(markersLayer)
  }

  const data = filteredData.value
  const markers: any[] = []
  const AMap = (window as any).AMap

  if (!AMap) {
    return
  }

  for (const item of data) {
    const [glng, glat] = wgs84ToGcj02(item.lng, item.lat)
    const color = props.type === 'charging'
      ? getChargingColor((item as ChargingStation).type)
      : getServiceAreaColor((item as ServiceArea).hasCharging)

    const marker = new AMap.Marker({
      position: [glng, glat],
      title: item.name,
      content: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
      offset: [-8, -8],
    })

    const infoWindow = new AMap.InfoWindow({
      content: buildPopupContent(item),
      offset: [0, -12],
    })

    marker.on('click', () => {
      infoWindow.open(mapInstance, [glng, glat])
    })

    markers.push(marker)
  }

  markersLayer = markers
  mapInstance.add(markers)

  if (markers.length > 0) {
    mapInstance.setFitView(markers, false, [50, 50, 50, 50])
  }
}

function onKeyChanged() {
  if (checkKey() && useOsm && mapInstance) {
    mapInstance.remove()
    mapInstance = null
    markersLayer = null
    useOsm = false
    mapReady.value = false
    nextTick(() => initAmap())
  }
}

watch(selectedDay, () => {
  if (useOsm) {
    updateMarkers()
  } else {
    updateAmapMarkers()
  }
})

onMounted(async () => {
  await nextTick()
  if (checkKey()) {
    initAmap()
  } else {
    initOsm()
  }
  window.addEventListener('amap-key-changed', onKeyChanged)
})

onUnmounted(() => {
  window.removeEventListener('amap-key-changed', onKeyChanged)
  if (mapInstance) {
    if (useOsm) {
      mapInstance.remove()
    } else if (mapInstance.destroy) {
      mapInstance.destroy()
    }
  }
})
</script>

<template>
  <div class="full-map">
    <!-- Filter bar -->
    <div class="full-map-toolbar">
      <div class="day-filter">
        <button
          v-for="d in days"
          :key="d"
          :class="['day-btn', { active: selectedDay === d }]"
          @click="selectedDay = d"
        >
          {{ d === 0 ? '全部' : `Day ${d}` }}
        </button>
      </div>
      <div class="map-stats">
        <template v-if="type === 'charging'">
          <span class="stat-tag city">城区 {{ stats.city }}</span>
          <span class="stat-tag highway">高速出口 {{ stats.highway_exit }}</span>
          <span class="stat-tag service">服务区 {{ stats.service_area }}</span>
        </template>
        <template v-else>
          <span class="stat-tag has-charging">有充电 {{ stats.hasCharging }}</span>
          <span class="stat-tag no-charging">无充电 {{ stats.noCharging }}</span>
        </template>
        <span class="stat-total">共 {{ stats.total }} 个</span>
      </div>
    </div>

    <!-- Map container -->
    <div ref="mapContainer" class="full-map-container" :style="{ height: height + 'px' }" />

    <!-- Legend -->
    <div class="full-map-legend">
      <template v-if="type === 'charging'">
        <span class="legend-item"><span class="legend-dot" style="background:#2196F3"></span>城区充电站</span>
        <span class="legend-item"><span class="legend-dot" style="background:#4CAF50"></span>高速出口附近</span>
        <span class="legend-item"><span class="legend-dot" style="background:#FF9800"></span>高速服务区</span>
      </template>
      <template v-else>
        <span class="legend-item"><span class="legend-dot" style="background:#4CAF50"></span>有充电桩</span>
        <span class="legend-item"><span class="legend-dot" style="background:#9E9E9E"></span>无充电桩</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.full-map {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.full-map-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.day-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.day-btn {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.day-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.day-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.map-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
}

.stat-tag {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  color: #fff;
}

.stat-tag.city { background: #2196F3; }
.stat-tag.highway { background: #4CAF50; }
.stat-tag.service { background: #FF9800; }
.stat-tag.has-charging { background: #4CAF50; }
.stat-tag.no-charging { background: #9E9E9E; }

.stat-total {
  color: var(--vp-c-text-3);
  font-weight: 600;
}

.full-map-container {
  width: 100%;
}

.full-map-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

@media (max-width: 640px) {
  .full-map-container {
    height: 400px !important;
  }

  .full-map-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
