<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

export interface GalleryImage {
  /** 图片路径 */
  src: string
  /** 图片描述 */
  alt: string
}

const props = defineProps<{
  /** 图片列表 */
  images: GalleryImage[]
}>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

/* 手势滑动支持 */
let touchStartX = 0
let touchEndX = 0

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) {
    return
  }
  if (e.key === 'Escape') {
    closeLightbox()
  } else if (e.key === 'ArrowLeft') {
    prev()
  } else if (e.key === 'ArrowRight') {
    next()
  }
}

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      next()
    } else {
      prev()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- 缩略图网格 -->
  <div class="gallery-grid">
    <div
      v-for="(img, index) in images"
      :key="index"
      class="gallery-grid__item"
      @click="openLightbox(index)"
    >
      <img :src="img.src" :alt="img.alt" loading="lazy" />
    </div>
  </div>

  <!-- 灯箱 -->
  <Teleport to="body">
    <div
      v-if="lightboxOpen"
      class="lightbox-overlay"
      @click.self="closeLightbox"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <button class="lightbox-close" @click="closeLightbox">&times;</button>
      <button class="lightbox-arrow lightbox-arrow--prev" @click.stop="prev">&#8249;</button>
      <img
        :src="images[lightboxIndex].src"
        :alt="images[lightboxIndex].alt"
      />
      <button class="lightbox-arrow lightbox-arrow--next" @click.stop="next">&#8250;</button>
      <div class="lightbox-caption">{{ images[lightboxIndex].alt }}</div>
    </div>
  </Teleport>
</template>
