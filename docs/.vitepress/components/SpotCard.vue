<script setup lang="ts">
defineProps<{
  /** 地点名称 */
  name: string
  /** 类型 */
  type: 'spot' | 'food' | 'sleep'
  /** 图片路径 */
  image?: string
  /** 地址 */
  address?: string
  /** 描述 */
  description?: string
  /** 小红书链接 */
  xhsLink?: string
  /** 可跳过指数（1-5） */
  skipIndex?: number
}>()
</script>

<template>
  <div class="spot-card">
    <!-- 图片 -->
    <img
      v-if="image"
      :src="image"
      :alt="name"
      class="spot-card__image"
      loading="lazy"
    />
    <div v-else class="spot-card__image--placeholder">暂无图片</div>

    <!-- 内容 -->
    <div class="spot-card__body">
      <h4 class="spot-card__name">{{ name }}</h4>
      <p v-if="address" class="spot-card__address">{{ address }}</p>
      <p v-if="description" class="spot-card__desc">{{ description }}</p>

      <div class="spot-card__meta">
        <!-- 可跳过指数（food 类型不显示） -->
        <span v-if="type !== 'food' && skipIndex" class="spot-card__skip">
          可跳过：<template v-for="i in 5" :key="i">{{ i <= skipIndex ? '&#9733;' : '&#9734;' }}</template>
        </span>

        <!-- 小红书链接 -->
        <a
          v-if="xhsLink"
          :href="xhsLink"
          class="spot-card__xhs-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          &#x1F4D5; 小红书
        </a>
      </div>
    </div>
  </div>
</template>
