<script setup lang="ts">
import { computed } from 'vue'

export interface ChargingDay {
  /** 第几天 */
  day: number
  /** 出发电量百分比 */
  start: number
  /** 到达电量百分比 */
  end: number
  /** 充电地点 */
  chargeAt?: string
  /** 充电后电量百分比 */
  chargeTo?: number
}

const props = defineProps<{
  /** 充电计划 */
  plan: ChargingDay[]
}>()

function barColor(percent: number): string {
  if (percent <= 20) {
    return 'charging-plan__bar-fill--low'
  }
  if (percent <= 50) {
    return 'charging-plan__bar-fill--mid'
  }
  return 'charging-plan__bar-fill--high'
}
</script>

<template>
  <div class="charging-plan">
    <div
      v-for="item in plan"
      :key="item.day"
      class="charging-plan__row"
    >
      <span class="charging-plan__day">Day {{ item.day }}</span>

      <div class="charging-plan__bar-wrapper">
        <!-- 电量条：显示到达时的电量 -->
        <div
          class="charging-plan__bar-fill"
          :class="barColor(item.end)"
          :style="{ width: `${item.end}%` }"
        />

        <!-- 充电标记 -->
        <template v-if="item.chargeAt && item.chargeTo">
          <div
            class="charging-plan__charge-marker"
            :style="{ left: `${item.end}%` }"
          />
          <span
            class="charging-plan__charge-label"
            :style="{ left: `${item.end}%` }"
          >
            &#x26A1; {{ item.chargeAt }}
          </span>
        </template>
      </div>

      <span class="charging-plan__info">
        {{ item.start }}% &rarr; {{ item.end }}%
        <template v-if="item.chargeTo">
          &rarr; {{ item.chargeTo }}%
        </template>
      </span>
    </div>
  </div>
</template>
