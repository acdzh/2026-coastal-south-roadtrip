<script setup lang="ts">
import { ref, computed } from 'vue'

export interface BudgetItem {
  /** 第几天 */
  day: number
  /** 类别（油费/住宿/餐饮/门票/过路费/其他） */
  category: string
  /** 具体项目 */
  item: string
  /** 金额（元） */
  amount: number
}

const props = defineProps<{
  /** 预算项列表 */
  items: BudgetItem[]
}>()

type ViewMode = 'all' | 'by-day' | 'by-category'

const viewMode = ref<ViewMode>('all')

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + item.amount, 0)
})

/** 按天汇总 */
const byDay = computed(() => {
  const map = new Map<number, number>()
  for (const item of props.items) {
    map.set(item.day, (map.get(item.day) || 0) + item.amount)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([day, amount]) => ({ day, amount }))
})

/** 按类别汇总 */
const byCategory = computed(() => {
  const map = new Map<string, number>()
  for (const item of props.items) {
    map.set(item.category, (map.get(item.category) || 0) + item.amount)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ category, amount }))
})
</script>

<template>
  <div>
    <!-- 切换标签 -->
    <div class="budget-table__tabs">
      <button
        class="budget-table__tab"
        :class="{ 'budget-table__tab--active': viewMode === 'all' }"
        @click="viewMode = 'all'"
      >
        全部明细
      </button>
      <button
        class="budget-table__tab"
        :class="{ 'budget-table__tab--active': viewMode === 'by-day' }"
        @click="viewMode = 'by-day'"
      >
        按天汇总
      </button>
      <button
        class="budget-table__tab"
        :class="{ 'budget-table__tab--active': viewMode === 'by-category' }"
        @click="viewMode = 'by-category'"
      >
        按类型汇总
      </button>
    </div>

    <div class="budget-table-wrapper">
      <!-- 全部明细 -->
      <table v-if="viewMode === 'all'" class="budget-table">
        <thead>
          <tr>
            <th>天</th>
            <th>类别</th>
            <th>项目</th>
            <th>金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in items" :key="i">
            <td>Day {{ row.day }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.item }}</td>
            <td>&yen;{{ row.amount }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="budget-table__total">总计</td>
            <td class="budget-table__total">&yen;{{ total }}</td>
          </tr>
        </tfoot>
      </table>

      <!-- 按天汇总 -->
      <table v-else-if="viewMode === 'by-day'" class="budget-table">
        <thead>
          <tr>
            <th>天</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in byDay" :key="row.day">
            <td>Day {{ row.day }}</td>
            <td>&yen;{{ row.amount }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="budget-table__total">总计</td>
            <td class="budget-table__total">&yen;{{ total }}</td>
          </tr>
        </tfoot>
      </table>

      <!-- 按类型汇总 -->
      <table v-else class="budget-table">
        <thead>
          <tr>
            <th>类别</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in byCategory" :key="row.category">
            <td>{{ row.category }}</td>
            <td>&yen;{{ row.amount }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="budget-table__total">总计</td>
            <td class="budget-table__total">&yen;{{ total }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
