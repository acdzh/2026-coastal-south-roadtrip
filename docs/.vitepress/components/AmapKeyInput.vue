<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { decryptAmapKeys } from '../utils/ecies'

const amapKey = ref('')
const securityKey = ref('')
const saved = ref(false)
const visible = ref(false)
const decrypting = ref(false)
const decryptError = ref(false)

async function tryDecryptFromQuery(): Promise<boolean> {
  const params = new URLSearchParams(location.search)
  const password = params.get('key')
  if (!password) {
    return false
  }
  decrypting.value = true
  decryptError.value = false
  try {
    const [k, s] = await decryptAmapKeys(password)
    localStorage.setItem('AMAP_KEY', k)
    localStorage.setItem('AMAP_SECURITY_KEY', s)
    amapKey.value = k
    securityKey.value = s
    saved.value = true
    window.dispatchEvent(new Event('amap-key-changed'))
    return true
  } catch {
    decryptError.value = true
    return false
  } finally {
    decrypting.value = false
  }
}

onMounted(async () => {
  const k = localStorage.getItem('AMAP_KEY')
  const s = localStorage.getItem('AMAP_SECURITY_KEY')
  if (k && s) {
    amapKey.value = k
    securityKey.value = s
    saved.value = true
  } else {
    await tryDecryptFromQuery()
  }
})

function save() {
  if (!amapKey.value.trim() || !securityKey.value.trim()) {
    return
  }
  localStorage.setItem('AMAP_KEY', amapKey.value.trim())
  localStorage.setItem('AMAP_SECURITY_KEY', securityKey.value.trim())
  saved.value = true
  visible.value = false
  window.dispatchEvent(new Event('amap-key-changed'))
}

function clear() {
  localStorage.removeItem('AMAP_KEY')
  localStorage.removeItem('AMAP_SECURITY_KEY')
  amapKey.value = ''
  securityKey.value = ''
  saved.value = false
  visible.value = true
  window.dispatchEvent(new Event('amap-key-changed'))
}

function toggle() {
  visible.value = !visible.value
}
</script>

<template>
  <div class="amap-key-input">
    <div v-if="decrypting" class="amap-key-saved">
      <span>🔐 正在解密地图密钥…</span>
    </div>
    <div v-else-if="decryptError" class="amap-key-error">
      <span>❌ 密钥解密失败，请检查 URL 中的 key 参数</span>
    </div>
    <div v-else-if="saved && !visible" class="amap-key-saved" @click="toggle">
      <span>🗺️ 高德地图 Key 已配置</span>
      <button class="amap-key-btn amap-key-btn--sm" @click.stop="toggle">修改</button>
    </div>
    <div v-else-if="!saved && !visible" class="amap-key-hint-bar" @click="toggle">
      <span>🗺️ 当前使用 OpenStreetMap 地图</span>
      <button class="amap-key-btn amap-key-btn--sm" @click.stop="toggle">配置高德 Key</button>
    </div>
    <div v-if="visible" class="amap-key-form">
      <p class="amap-key-hint">
        配置高德地图 Key 以启用交互式地图。
        <a href="https://lbs.amap.com/api/javascript-api-v2/guide/abc/prepare" target="_blank">如何获取？</a>
      </p>
      <div class="amap-key-fields">
        <input
          v-model="amapKey"
          type="text"
          placeholder="AMAP_KEY"
          class="amap-key-input-field"
        />
        <input
          v-model="securityKey"
          type="text"
          placeholder="AMAP_SECURITY_KEY"
          class="amap-key-input-field"
        />
        <div class="amap-key-actions">
          <button class="amap-key-btn amap-key-btn--primary" @click="save">保存</button>
          <button v-if="saved" class="amap-key-btn" @click="clear">清除</button>
          <button v-if="saved" class="amap-key-btn" @click="toggle">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.amap-key-input {
  margin: 16px 0;
}
.amap-key-saved {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.amap-key-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-danger-soft);
  border-radius: 8px;
  font-size: 14px;
  color: var(--vp-c-danger-1);
}
.amap-key-hint-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.amap-key-form {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}
.amap-key-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.amap-key-hint a {
  color: var(--vp-c-brand-1);
}
.amap-key-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.amap-key-input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  box-sizing: border-box;
}
.amap-key-input-field:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.amap-key-actions {
  display: flex;
  gap: 8px;
}
.amap-key-btn {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  min-height: 44px;
}
.amap-key-btn--primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}
.amap-key-btn--sm {
  padding: 4px 12px;
  font-size: 12px;
  min-height: auto;
}
</style>
