<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { routes } from '../data/routes'

const mapContainer = ref<HTMLElement>()
const hasKey = ref(false)
let mapInstance: any = null

function checkKey() {
  hasKey.value = !!(localStorage.getItem('AMAP_KEY') && localStorage.getItem('AMAP_SECURITY_KEY'))
}

async function initMap() {
  if (!mapContainer.value || !hasKey.value || routes.length === 0) {
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
    })

    mapInstance = new AMap.Map(mapContainer.value, {
      zoom: 7,
      viewMode: '2D'
    })

    const allMarkers: any[] = []

    for (const route of routes) {
      const corePoints = route.points.filter(p =>
        p.type === 'start' || p.type === 'end' || p.type === 'spot'
      )
      for (const p of corePoints) {
        const marker = new AMap.Marker({
          position: [p.lng, p.lat],
          title: `Day ${route.day}: ${p.name}`,
          label: { content: `D${route.day} ${p.name}`, direction: 'top' },
        })
        marker.on('click', () => {
          if (p.link) {
            window.location.href = p.link
          }
        })
        allMarkers.push(marker)
      }

      if (route.points.length >= 2) {
        const path = route.points.map(p => [p.lng, p.lat])
        const polyline = new AMap.Polyline({
          path,
          strokeColor: route.color,
          strokeWeight: 4,
          strokeOpacity: 0.8,
        })
        mapInstance.add(polyline)
      }
    }

    mapInstance.add(allMarkers)
    mapInstance.setFitView(allMarkers, false, [50, 50, 50, 50])
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
  <div class="overview-map">
    <template v-if="routes.length > 0">
      <div v-if="hasKey" ref="mapContainer" class="overview-map-container" />
      <div v-else class="overview-map-fallback">
        <img
          :src="'/images/route/overview.jpg'"
          alt="7天路线总览"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
        <p class="overview-map-hint">配置高德地图 Key 查看交互地图</p>
      </div>
    </template>
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
.overview-map-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  background: var(--vp-c-bg-soft);
  padding: 24px;
}
.overview-map-fallback img {
  max-width: 100%;
  border-radius: 6px;
}
.overview-map-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.overview-map-empty {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
}
</style>
