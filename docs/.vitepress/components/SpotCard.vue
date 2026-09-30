<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  type: 'spot' | 'food' | 'sleep'
  image?: string
  address?: string
  description?: string
  xhsLink?: string
  skipIndex?: number
}>(), {
  skipIndex: 0
})

const imgError = ref(false)
const showLightbox = ref(false)

const typeLabel: Record<string, string> = {
  spot: '景点',
  food: '美食',
  sleep: '过夜',
}

const typeIcon: Record<string, string> = {
  spot: '🏖️',
  food: '🍜',
  sleep: '🅿️',
}
</script>

<template>
  <div class="spot-card" :class="`spot-card--${type}`">
    <div class="spot-card-image" @click="image && !imgError && (showLightbox = true)">
      <img
        v-if="image && !imgError"
        :src="image"
        :alt="name"
        loading="lazy"
        @error="imgError = true"
      />
      <div v-else class="spot-card-placeholder">
        <span class="spot-card-placeholder-icon">{{ typeIcon[type] }}</span>
        <span class="spot-card-placeholder-label">{{ typeLabel[type] }}</span>
      </div>
    </div>
    <div class="spot-card-content">
      <div class="spot-card-header">
        <h4 class="spot-card-name">{{ name }}</h4>
        <div v-if="type !== 'food' && skipIndex > 0" class="spot-card-skip">
          <span v-for="i in 5" :key="i" class="spot-card-star" :class="{ active: i <= skipIndex }">⭐</span>
          <span class="spot-card-skip-label">可跳过</span>
        </div>
      </div>
      <p v-if="address" class="spot-card-address">📍 {{ address }}</p>
      <p v-if="description" class="spot-card-desc">{{ description }}</p>
      <a v-if="xhsLink" :href="xhsLink" target="_blank" class="spot-card-xhs">
        📕 小红书
      </a>
    </div>

    <Teleport to="body">
      <div v-if="showLightbox" class="spot-card-lightbox" @click="showLightbox = false">
        <img :src="image" :alt="name" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.spot-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
@media (max-width: 640px) {
  .spot-card {
    flex-direction: column;
  }
}
.spot-card-image {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}
@media (max-width: 640px) {
  .spot-card-image {
    width: 100%;
    height: 200px;
  }
}
.spot-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.spot-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-alt);
}
.spot-card-placeholder-icon {
  font-size: 32px;
}
.spot-card-placeholder-label {
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.spot-card-content {
  flex: 1;
  min-width: 0;
}
.spot-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.spot-card-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.spot-card-skip {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}
.spot-card-star {
  font-size: 10px;
  opacity: 0.3;
}
.spot-card-star.active {
  opacity: 1;
}
.spot-card-skip-label {
  margin-left: 4px;
  color: var(--vp-c-text-3);
}
.spot-card-address {
  margin: 8px 0 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.spot-card-desc {
  margin: 4px 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}
.spot-card-xhs {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.spot-card-xhs:hover {
  text-decoration: underline;
}
.spot-card-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.spot-card-lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
}
</style>
