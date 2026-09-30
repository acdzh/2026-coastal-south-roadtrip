<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  storageKey: string
  items: { id: string; label: string }[]
}>()

const checked = ref<Record<string, boolean>>({})

onMounted(() => {
  try {
    const saved = localStorage.getItem(`checklist-${props.storageKey}`)
    if (saved) {
      checked.value = JSON.parse(saved)
    }
  } catch {}
})

watch(checked, (val) => {
  localStorage.setItem(`checklist-${props.storageKey}`, JSON.stringify(val))
}, { deep: true })

function toggle(id: string) {
  checked.value[id] = !checked.value[id]
}

function clearAll() {
  checked.value = {}
}
</script>

<template>
  <div class="checklist">
    <div
      v-for="item in items"
      :key="item.id"
      class="checklist-item"
      :class="{ 'checklist-item--done': checked[item.id] }"
      @click="toggle(item.id)"
    >
      <span class="checklist-box">{{ checked[item.id] ? '✅' : '⬜' }}</span>
      <span class="checklist-label">{{ item.label }}</span>
    </div>
    <button
      v-if="Object.values(checked).some(Boolean)"
      class="checklist-clear"
      @click.stop="clearAll"
    >清除所有勾选</button>
  </div>
</template>

<style scoped>
.checklist {
  margin: 12px 0;
}
.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.checklist-item:hover {
  background: var(--vp-c-bg-soft);
}
.checklist-item--done .checklist-label {
  text-decoration: line-through;
  color: var(--vp-c-text-3);
}
.checklist-box {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1.4;
}
.checklist-label {
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.checklist-clear {
  margin-top: 8px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
}
.checklist-clear:hover {
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-text-3);
}
</style>
