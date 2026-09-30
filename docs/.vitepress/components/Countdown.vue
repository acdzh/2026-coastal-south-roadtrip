<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const departureDate = new Date('2026-10-01T00:00:00+08:00')
const tripDays = 7
const totalKm = 1950

const state = computed(() => {
  const today = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  const dep = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate())
  const diffMs = today.getTime() - dep.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { type: 'before' as const, days: Math.abs(diffDays) }
  }
  if (diffDays === 0) {
    return { type: 'departure' as const }
  }
  if (diffDays >= 1 && diffDays < tripDays) {
    return { type: 'during' as const, day: diffDays + 1 }
  }
  return { type: 'ended' as const }
})
</script>

<template>
  <div class="countdown-wrap">
    <div v-if="state.type === 'before'" class="countdown">
      <span class="countdown__label">距出发还有</span>
      <span class="countdown__number">{{ state.days }}</span>
      <span class="countdown__label">天</span>
    </div>
    <div v-else-if="state.type === 'departure'" class="countdown countdown--go">
      <span class="countdown__text">今天出发！🚗</span>
      <a href="/days/day1" class="countdown__link">查看今天行程 →</a>
    </div>
    <div v-else-if="state.type === 'during'" class="countdown countdown--during">
      <span class="countdown__label">行程第</span>
      <span class="countdown__number">{{ state.day }}</span>
      <span class="countdown__label">天</span>
      <a :href="'/days/day' + state.day" class="countdown__link">查看今天行程 →</a>
    </div>
    <div v-else class="countdown countdown--ended">
      <span class="countdown__text">旅途已结束，共 {{ tripDays }} 天 {{ totalKm }}km</span>
    </div>
  </div>
</template>

<style scoped>
.countdown-wrap {
  display: flex;
  justify-content: center;
  margin: 24px 0 8px;
}

.countdown {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px 32px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.countdown__label {
  font-size: 18px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.countdown__number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  color: var(--vp-c-brand-1);
}

.countdown__text {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.countdown__link {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.countdown__link:hover {
  text-decoration: underline;
}

.countdown--go {
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
}

.countdown--during {
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
}

.countdown--ended .countdown__text {
  font-size: 20px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .countdown {
    padding: 12px 20px;
  }

  .countdown__number {
    font-size: 36px;
  }

  .countdown__label {
    font-size: 15px;
  }

  .countdown__text {
    font-size: 22px;
  }

  .countdown--ended .countdown__text {
    font-size: 16px;
  }
}
</style>
