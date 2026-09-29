import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '2026国庆 · 浙闽沿海环线自驾',
  description: '7天自驾攻略',

  /* 暗色模式 */
  appearance: true,

  /* 本地搜索 */
  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '攻略指南', link: '/guide/preparation' },
      { text: '每日行程', link: '/days/day1' },
    ],

    sidebar: [
      {
        text: '攻略指南',
        items: [
          { text: '行前准备', link: '/guide/preparation' },
          { text: '住宿攻略', link: '/guide/sleep-guide' },
          { text: '美食攻略', link: '/guide/food-guide' },
          { text: '预算规划', link: '/guide/budget' },
          { text: '应急预案', link: '/guide/emergency' },
        ],
      },
      {
        text: '每日行程',
        items: [
          { text: 'Day 1 · 出发', link: '/days/day1' },
          { text: 'Day 2', link: '/days/day2' },
          { text: 'Day 3', link: '/days/day3' },
          { text: 'Day 4', link: '/days/day4' },
          { text: 'Day 5', link: '/days/day5' },
          { text: 'Day 6', link: '/days/day6' },
          { text: 'Day 7 · 返程', link: '/days/day7' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/acdzh/2026-coastal-south-roadtrip' },
    ],

    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
})
