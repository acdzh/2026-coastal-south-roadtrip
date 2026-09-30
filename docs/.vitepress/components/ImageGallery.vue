<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface GalleryImage {
  src: string
  alt: string
}

defineProps<{ images: GalleryImage[] }>()

const lightboxIndex = ref(-1)
const touchStartX = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = -1
  document.body.style.overflow = ''
}

function prev(total: number) {
  lightboxIndex.value = (lightboxIndex.value - 1 + total) % total
}

function next(total: number) {
  lightboxIndex.value = (lightboxIndex.value + 1) % total
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent, total: number) {
  const dx = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(dx) > 50) {
    if (dx > 0) {
      prev(total)
    } else {
      next(total)
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value < 0) {
    return
  }
  if (e.key === 'Escape') {
    closeLightbox()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="gallery">
    <div class="gallery-grid">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="gallery-thumb"
        @click="openLightbox(i)"
      >
        <img :src="img.src" :alt="img.alt" loading="lazy" />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxIndex >= 0"
        class="gallery-lightbox"
        @click.self="closeLightbox"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd($event, images.length)"
      >
        <button class="gallery-lb-close" @click="closeLightbox">✕</button>
        <button class="gallery-lb-prev" @click="prev(images.length)">‹</button>
        <img
          :src="images[lightboxIndex].src"
          :alt="images[lightboxIndex].alt"
          class="gallery-lb-img"
        />
        <button class="gallery-lb-next" @click="next(images.length)">›</button>
        <p class="gallery-lb-alt">{{ images[lightboxIndex].alt }}</p>
        <p class="gallery-lb-counter">{{ lightboxIndex + 1 }} / {{ images.length }}</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
}
@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.gallery-thumb {
  aspect-ratio: 4 / 3;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}
.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}
.gallery-thumb:hover img {
  transform: scale(1.05);
}
.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  user-select: none;
}
.gallery-lb-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
}
.gallery-lb-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gallery-lb-prev,
.gallery-lb-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gallery-lb-prev {
  left: 16px;
}
.gallery-lb-next {
  right: 16px;
}
.gallery-lb-alt {
  position: absolute;
  bottom: 40px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: center;
  max-width: 80vw;
}
.gallery-lb-counter {
  position: absolute;
  bottom: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}
</style>
