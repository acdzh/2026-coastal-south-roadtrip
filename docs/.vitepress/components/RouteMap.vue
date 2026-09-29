<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { routes } from '../data/routes'
import type { DayRoute, RoutePoint } from '../data/routes'

const props = defineProps<{
  /** 第几天（1-7） */
  day: number
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const hasKey = ref(false)
let mapInstance: any = null

/** 类型对应的 marker 颜色 */
const MARKER_COLORS: Record<RoutePoint['type'], string> = {
  start: '#22c55e',
  end: '#ef4444',
  spot: '#3b82f6',
  food: '#f97316',
  charge: '#eab308',
  sleep: '#a855f7',
  waypoint: '#9ca3af',
}

function getDayRoute(): DayRoute | undefined {
  return routes.find((r) => r.day === props.day)
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

    /* 设置安全密钥 */
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
  const dayRoute = getDayRoute()

  mapInstance = new AMap.Map(mapContainer.value, {
    zoom: 8,
    center: dayRoute?.points?.[0]
      ? [dayRoute.points[0].lng, dayRoute.points[0].lat]
      : [120.15, 27.5],
    viewMode: '2D',
  })

  if (dayRoute) {
    for (const point of dayRoute.points) {
      const marker = new AMap.Marker({
        position: [point.lng, point.lat],
        title: point.name,
        content: `<div style="
          width:12px;height:12px;border-radius:50%;
          background:${MARKER_COLORS[point.type] || '#9ca3af'};
          border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);
        "></div>`,
        offset: new AMap.Pixel(-6, -6),
      })
      marker.setMap(mapInstance)
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

watch(
  () => props.day,
  () => {
    if (mapInstance) {
      mapInstance.destroy()
      mapInstance = null
    }
    initMap()
  },
)
</script>

<template>
  <div class="route-map-container">
    <!-- 有 Key 时渲染地图 -->
    <div v-if="hasKey" ref="mapContainer" style="width: 100%; height: 100%" />

    <!-- 无 Key 时 fallback -->
    <div v-else class="route-map-placeholder">
      <span class="route-map-placeholder__icon">&#x1F5FA;</span>
      <span class="route-map-placeholder__text">请先配置高德地图 Key 以查看路线地图</span>
    </div>
  </div>
</template>
