<script setup lang="ts">
import { ref, computed } from 'vue'

interface BudgetItem {
  day: number
  category: string
  item: string
  amount: number
}

const props = defineProps<{ items: BudgetItem[] }>()

type GroupBy = 'day' | 'category'
const groupBy = ref<GroupBy>('day')

const grouped = computed(() => {
  const map = new Map<string, BudgetItem[]>()
  for (const item of props.items) {
    const key = groupBy.value === 'day' ? `Day ${item.day}` : item.category
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(item)
  }
  return map
})

const total = computed(() => props.items.reduce((sum, i) => sum + i.amount, 0))
</script>

<template>
  <div class="budget-table">
    <div class="budget-toggle">
      <button
        :class="{ active: groupBy === 'day' }"
        @click="groupBy = 'day'"
      >按天</button>
      <button
        :class="{ active: groupBy === 'category' }"
        @click="groupBy = 'category'"
      >按类型</button>
    </div>
    <div class="budget-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ groupBy === 'day' ? '天数' : '类型' }}</th>
            <th>项目</th>
            <th>金额</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="[group, items] in grouped" :key="group">
            <tr v-for="(item, i) in items" :key="`${group}-${i}`">
              <td v-if="i === 0" :rowspan="items.length" class="budget-group">{{ group }}</td>
              <td>{{ item.item }}</td>
              <td class="budget-amount">¥{{ item.amount }}</td>
            </tr>
            <tr class="budget-subtotal">
              <td colspan="2">小计</td>
              <td class="budget-amount">¥{{ items.reduce((s, i) => s + i.amount, 0) }}</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"><strong>总计</strong></td>
            <td class="budget-amount"><strong>¥{{ total }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.budget-table {
  margin: 16px 0;
}
.budget-toggle {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
.budget-toggle button {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 13px;
  min-height: 36px;
}
.budget-toggle button.active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}
.budget-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th, td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}
th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.budget-group {
  font-weight: 500;
  vertical-align: top;
}
.budget-amount {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.budget-subtotal {
  background: var(--vp-c-bg-soft);
  font-size: 13px;
}
.budget-subtotal td {
  color: var(--vp-c-text-2);
}
tfoot td {
  background: var(--vp-c-bg-soft);
  border-top: 2px solid var(--vp-c-divider);
}
</style>
