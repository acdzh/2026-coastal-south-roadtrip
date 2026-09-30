<script setup lang="ts">
interface TimelineEvent {
  time: string
  label: string
  type: string
}

defineProps<{ events: TimelineEvent[] }>()

const typeColors: Record<string, string> = {
  drive: '#2196F3',
  spot: '#4CAF50',
  food: '#FF9800',
  charge: '#FFEB3B',
  sleep: '#9C27B0',
  checklist: '#9E9E9E',
}
</script>

<template>
  <div class="timeline">
    <div v-for="(event, i) in events" :key="i" class="timeline-item">
      <div class="timeline-time">{{ event.time }}</div>
      <div class="timeline-dot-wrap">
        <div
          class="timeline-dot"
          :style="{ background: typeColors[event.type] || '#9E9E9E' }"
        />
        <div v-if="i < events.length - 1" class="timeline-line" />
      </div>
      <div class="timeline-label">{{ event.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  margin: 16px 0;
  padding: 0;
}
.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 40px;
}
.timeline-time {
  flex-shrink: 0;
  width: 48px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-align: right;
  padding-top: 2px;
  font-variant-numeric: tabular-nums;
}
.timeline-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: var(--vp-c-divider);
}
.timeline-label {
  flex: 1;
  font-size: 14px;
  color: var(--vp-c-text-1);
  padding: 2px 0 12px;
  line-height: 1.4;
}
@media (max-width: 640px) {
  .timeline-item {
    gap: 8px;
  }
  .timeline-time {
    width: 40px;
    font-size: 12px;
  }
  .timeline-label {
    font-size: 13px;
  }
}
</style>
