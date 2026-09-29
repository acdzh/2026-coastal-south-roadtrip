<script setup lang="ts">
export interface TimelineEvent {
  /** 时间（如 "08:00"） */
  time: string
  /** 内容 */
  label: string
  /** 类型 */
  type: 'drive' | 'spot' | 'food' | 'charge' | 'sleep' | 'checklist'
}

defineProps<{
  /** 事件列表 */
  events: TimelineEvent[]
}>()
</script>

<template>
  <div class="timeline">
    <div
      v-for="(event, index) in events"
      :key="index"
      class="timeline__item"
    >
      <span
        class="timeline__dot"
        :class="`timeline__dot--${event.type}`"
      />
      <span class="timeline__time">{{ event.time }}</span>
      <span class="timeline__label">{{ event.label }}</span>
    </div>
  </div>
</template>
