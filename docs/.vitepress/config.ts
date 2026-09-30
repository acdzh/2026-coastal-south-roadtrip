import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '2026国庆 · 浙闽沿海环线自驾',
  description: '上海出发，沿海南下，内陆北上，7天环线自驾攻略',
  lang: 'zh-CN',
  base: '/2026-coastal-south-roadtrip/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/2026-coastal-south-roadtrip/favicon.svg' }],
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
          { text: 'Day 5: 霞浦 → 福州', link: '/days/day5' },
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
    ssr: {
      noExternal: ['@amap/amap-jsapi-loader']
    }
  }
})
