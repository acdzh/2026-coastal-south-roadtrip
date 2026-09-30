import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  title: '2026国庆 · 浙闽沿海环线自驾',
  description: '上海出发，沿海南下，内陆北上，7天环线自驾攻略',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#2196F3' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.svg' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '攻略指南', link: '/guide/preparation' },
      { text: '每日行程', link: '/days/day1' },
    ],

    sidebar: [
      {
        text: '📋 攻略指南',
        items: [
          { text: '出发前准备', link: '/guide/preparation' },
          { text: 'SUV睡车指南', link: '/guide/sleep-guide' },
          { text: '沿途美食地图', link: '/guide/food-guide' },
          { text: '费用预估', link: '/guide/budget' },
          { text: '应急信息', link: '/guide/emergency' },
        ]
      },
      {
        text: '📅 每日行程',
        items: [
          { text: 'Day 1: 上海 → 台州', link: '/days/day1' },
          { text: 'Day 2: 台州 → 温州', link: '/days/day2' },
          { text: 'Day 3: 温州 → 福鼎', link: '/days/day3' },
          { text: 'Day 4: 福鼎 → 霞浦', link: '/days/day4' },
          { text: 'Day 5: 霞浦 → 福州 → 平潭', link: '/days/day5' },
          { text: 'Day 6: 福州 → 衢州（回程）', link: '/days/day6' },
          { text: 'Day 7: 衢州 → 上海（回程）', link: '/days/day7' },
        ]
      },
    ],

    search: {
      provider: 'local'
    },

    darkModeSwitchLabel: '深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },

  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /\/images\/.*\.(?:webp|jpg|png|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /^https:\/\/router\.project-osrm\.org\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'osrm-routes',
                expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles',
                expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
              },
            },
          ],
        },
      }),
    ],
    ssr: {
      noExternal: ['@amap/amap-jsapi-loader']
    }
  }
})
