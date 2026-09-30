<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { routes } from '../data/routes'

const props = defineProps<{ day: number }>()

const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
const hasKey = ref(false)
let mapInstance: any = null

const dayRoute = routes.find(r => r.day === props.day)

function checkKey() {
  hasKey.value = !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

async function initMap() {
  if (!mapContainer.value || !hasKey.value || !dayRoute) {
    return
  }

  const key = localStorage.getItem('AMAP_KEY')!
  const securityKey = localStorage.getItem('AMAP_SECURITY_KEY')!

  window._AMapSecurityConfig = { securityJsCode: securityKey }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.Driving']
    })

    mapInstance = new AMap.Map(mapContainer.value, {
      zoom: 9,
      viewMode: '2D'
    })

    if (dayRoute.points.length > 0) {
      const markers = dayRoute.points.map(p => {
        const colorMap: Record<string, string> = {
          start: '#4CAF50', end: '#F44336', spot: '#2196F3',
          food: '#FF9800', charge: '#FFEB3B', sleep: '#9C27B0', waypoint: '#607D8B'
        }
        return new AMap.Marker({
          position: [p.lng, p.lat],
          title: p.name,
          label: { content: p.name, direction: 'top' },
        })
      })
      mapInstance.add(markers)
      mapInstance.setFitView(markers, false, [50, 50, 50, 50])
    }

    mapReady.value = true
  } catch (e) {
    console.warn('AMap load failed:', e)
  }
}

function onKeyChanged() {
  checkKey()
  if (hasKey.value) {
    nextTick(() => initMap())
  }
}

onMounted(async () => {
  checkKey()
  if (hasKey.value) {
    await nextTick()
    initMap()
  }
  window.addEventListener('amap-key-changed', onKeyChanged)
})

onUnmounted(() => {
  window.removeEventListener('amap-key-changed', onKeyChanged)
  if (mapInstance) {
    mapInstance.destroy()
  }
})
</script>

<template>
  <div class="route-map">
    <div v-if="!dayRoute" class="route-map-empty">
      <p>暂无 Day {{ day }} 的路线数据</p>
    </div>
    <template v-else>
      <div v-if="hasKey" ref="mapContainer" class="route-map-container" />
      <div v-else class="route-map-fallback">
        <img
          :src="`/images/route/day${day}.jpg`"
          :alt="`Day ${day} 路线图`"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
        <p class="route-map-hint">配置高德地图 Key 查看交互地图</p>
      </div>
    </template>
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
.route-map-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: var(--vp-c-bg-soft);
  padding: 24px;
}
.route-map-fallback img {
  max-width: 100%;
  border-radius: 6px;
}
.route-map-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.route-map-empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
}
</style>
