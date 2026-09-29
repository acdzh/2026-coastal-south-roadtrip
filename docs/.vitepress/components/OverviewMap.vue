<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { routes } from '../data/routes'
import type { RoutePoint } from '../data/routes'

const mapContainer = ref<HTMLDivElement | null>(null)
const hasKey = ref(false)
let mapInstance: any = null

const MARKER_COLORS: Record<RoutePoint['type'], string> = {
  start: '#22c55e',
  end: '#ef4444',
  spot: '#3b82f6',
  food: '#f97316',
  charge: '#eab308',
  sleep: '#a855f7',
  waypoint: '#9ca3af',
}

function loadAmapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve()
      return
    }

    const apiKey = localStorage.getItem('AMAP_KEY')
    const secKey = localStorage.getItem('AMAP_SECURITY_KEY')
    if (!apiKey || !secKey) {
      reject(new Error('no key'))
      return
    }

    ;(window as any)._AMapSecurityConfig = { securityJsCode: secKey }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('script load failed'))
    document.head.appendChild(script)
  })
}

async function initMap() {
  const apiKey = localStorage.getItem('AMAP_KEY')
  const secKey = localStorage.getItem('AMAP_SECURITY_KEY')
  hasKey.value = !!(apiKey && secKey)

  if (!hasKey.value || !mapContainer.value) {
    return
  }

  try {
    await loadAmapScript()
  } catch {
    hasKey.value = false
    return
  }

  const AMap = (window as any).AMap

  mapInstance = new AMap.Map(mapContainer.value, {
    zoom: 7,
    center: [120.15, 27.5],
    viewMode: '2D',
  })

  /* 每天路线用不同颜色 */
  for (const dayRoute of routes) {
    /* 标注点 */
    for (const point of dayRoute.points) {
      const marker = new AMap.Marker({
        position: [point.lng, point.lat],
        title: `Day${dayRoute.day}: ${point.name}`,
        content: `<div style="
          width:10px;height:10px;border-radius:50%;
          background:${dayRoute.color || MARKER_COLORS[point.type] || '#9ca3af'};
          border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);
        "></div>`,
        offset: new AMap.Pixel(-5, -5),
      })
      marker.setMap(mapInstance)

      /* 点击跳转对应天的页面 */
      if (point.link) {
        marker.on('click', () => {
          window.location.href = point.link!
        })
      }
    }

    /* 画路线连线 */
    if (dayRoute.points.length >= 2) {
      const path = dayRoute.points.map((p) => [p.lng, p.lat])
      const polyline = new AMap.Polyline({
        path,
        strokeColor: dayRoute.color || '#3b82f6',
        strokeWeight: 3,
        strokeOpacity: 0.7,
        lineJoin: 'round',
      })
      polyline.setMap(mapInstance)
    }
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})
</script>

<template>
  <div class="route-map-container route-map-container--overview">
    <div v-if="hasKey" ref="mapContainer" style="width: 100%; height: 100%" />
    <div v-else class="route-map-placeholder">
      <span class="route-map-placeholder__icon">&#x1F5FA;</span>
      <span class="route-map-placeholder__text">请先配置高德地图 Key 以查看总览地图</span>
    </div>
  </div>
</template>
