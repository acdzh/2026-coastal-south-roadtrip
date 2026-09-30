<script setup lang="ts">
interface ChargePlan {
  day: number
  start: number
  end: number
  chargeAt?: string
  chargeTo?: number
}

defineProps<{ plan: ChargePlan[] }>()

function barStyle(start: number, end: number): Record<string, string> {
  const left = `${start}%`
  const width = `${Math.abs(end - start)}%`
  const color = end < 30 ? '#F44336' : end < 60 ? '#FF9800' : '#4CAF50'
  return { left, width, background: color }
}
</script>

<template>
  <div class="charging-plan">
    <div v-for="item in plan" :key="item.day" class="charging-row">
      <div class="charging-label">Day {{ item.day }}</div>
      <div class="charging-bar-wrap">
        <div class="charging-bar-bg">
          <div class="charging-bar" :style="barStyle(0, item.start)" />
          <div
            v-if="item.chargeAt && item.chargeTo"
            class="charging-bar charging-bar--charge"
            :style="barStyle(item.end, item.chargeTo)"
          />
        </div>
        <div class="charging-info">
          <span>{{ item.start }}%→{{ item.end }}%</span>
          <span v-if="item.chargeAt" class="charging-at">
            ⚡{{ item.chargeAt }} 充至{{ item.chargeTo }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charging-plan {
  margin: 16px 0;
}
.charging-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.charging-label {
  flex-shrink: 0;
  width: 48px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.charging-bar-wrap {
  flex: 1;
}
.charging-bar-bg {
  position: relative;
  height: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.charging-bar {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s;
}
.charging-bar--charge {
  opacity: 0.5;
}
.charging-info {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.charging-at {
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .charging-label {
    width: 40px;
    font-size: 12px;
  }
  .charging-info {
    flex-direction: column;
    gap: 0;
  }
}
</style>
