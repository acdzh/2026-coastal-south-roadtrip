<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY_API = 'AMAP_KEY'
const STORAGE_KEY_SEC = 'AMAP_SECURITY_KEY'

const apiKey = ref('')
const securityKey = ref('')
const configured = ref(false)
const editing = ref(false)

function checkConfig() {
  if (typeof window === 'undefined') {
    return
  }
  const storedApi = localStorage.getItem(STORAGE_KEY_API)
  const storedSec = localStorage.getItem(STORAGE_KEY_SEC)
  configured.value = !!(storedApi && storedSec)
}

function save() {
  if (!apiKey.value.trim() || !securityKey.value.trim()) {
    return
  }
  localStorage.setItem(STORAGE_KEY_API, apiKey.value.trim())
  localStorage.setItem(STORAGE_KEY_SEC, securityKey.value.trim())
  configured.value = true
  editing.value = false
}

function reset() {
  localStorage.removeItem(STORAGE_KEY_API)
  localStorage.removeItem(STORAGE_KEY_SEC)
  apiKey.value = ''
  securityKey.value = ''
  configured.value = false
  editing.value = true
}

onMounted(() => {
  checkConfig()
})
</script>

<template>
  <div class="amap-key-input">
    <!-- 已配置状态 -->
    <div v-if="configured && !editing" class="amap-key-input__status">
      <span>&#x2705; 高德地图 Key 已配置</span>
      <button class="amap-key-input__reset" @click="reset">重新配置</button>
    </div>

    <!-- 输入表单 -->
    <template v-else>
      <p class="amap-key-input__title">配置高德地图 Key</p>
      <div class="amap-key-input__field">
        <label class="amap-key-input__label">API Key</label>
        <input
          v-model="apiKey"
          class="amap-key-input__input"
          type="text"
          placeholder="输入高德 JS API Key"
        />
      </div>
      <div class="amap-key-input__field">
        <label class="amap-key-input__label">Security Key（安全密钥）</label>
        <input
          v-model="securityKey"
          class="amap-key-input__input"
          type="text"
          placeholder="输入安全密钥（jscode）"
        />
      </div>
      <button class="amap-key-input__btn" @click="save">保存</button>
    </template>
  </div>
</template>
