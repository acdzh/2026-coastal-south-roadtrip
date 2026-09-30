<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const expanded = ref(false)

const fm = computed(() => frontmatter.value || {})
</script>

<template>
  <div v-if="fm.date" class="day-summary" :class="{ 'day-summary--expanded': expanded }">
    <div class="day-summary-bar" @click="expanded = !expanded">
      <div class="day-summary-left">
        <span class="day-summary-date">{{ fm.date }}</span>
        <span class="day-summary-distance">{{ fm.distance }}</span>
        <span class="day-summary-driving">{{ fm.driving }}</span>
      </div>
      <span class="day-summary-toggle">{{ expanded ? '收起 ▲' : '详情 ▼' }}</span>
    </div>
    <div v-if="expanded" class="day-summary-detail">
      <div v-if="fm.overnight" class="day-summary-row">
        <span class="day-summary-label">过夜</span>
        <span>{{ fm.overnight }}</span>
      </div>
      <div v-if="fm.charging" class="day-summary-row">
        <span class="day-summary-label">充电</span>
        <span>{{ fm.charging }}</span>
      </div>
      <div v-if="fm.budget" class="day-summary-row">
        <span class="day-summary-label">预算</span>
        <span>{{ fm.budget }}</span>
      </div>
      <div v-if="fm.highlights" class="day-summary-row">
        <span class="day-summary-label">核心</span>
        <span>{{ fm.highlights }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-summary {
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 10;
  margin: 24px 0 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.day-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  gap: 12px;
  user-select: none;
}
.day-summary-bar:hover {
  background: var(--vp-c-bg-soft);
}
.day-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
}
.day-summary-date {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}
.day-summary-distance {
  font-size: 13px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
}
.day-summary-driving {
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.day-summary-toggle {
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  flex-shrink: 0;
}
.day-summary-detail {
  padding: 0 16px 12px;
  border-top: 1px solid var(--vp-c-divider);
}
.day-summary-row {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.day-summary-row + .day-summary-row {
  border-top: 1px dashed var(--vp-c-divider);
}
.day-summary-label {
  flex-shrink: 0;
  width: 36px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .day-summary-left {
    gap: 8px;
  }
  .day-summary-bar {
    padding: 8px 12px;
  }
  .day-summary-date {
    font-size: 13px;
  }
  .day-summary-distance,
  .day-summary-driving {
    font-size: 12px;
  }
}
</style>
