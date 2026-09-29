---
layout: home

hero:
  name: "2026国庆 · 浙闽沿海环线自驾"
  text: "7天环线 · 不走回头路"
  tagline: 上海出发，沿海南下经台州、温州、福州方向环线返回
  actions:
    - theme: brand
      text: 查看行程
      link: /days/day1
    - theme: alt
      text: 攻略指南
      link: /guide/preparation
---

<script setup>
import AmapKeyInput from './.vitepress/components/AmapKeyInput.vue'
import OverviewMap from './.vitepress/components/OverviewMap.vue'
</script>

## 地图配置

<AmapKeyInput />

## 路线总览

<OverviewMap />

## 关键数据

<div class="stats-row">
  <div class="stat-item">
    <div class="stat-item__value">7</div>
    <div class="stat-item__label">天</div>
  </div>
  <div class="stat-item">
    <div class="stat-item__value">~2000</div>
    <div class="stat-item__label">公里</div>
  </div>
  <div class="stat-item">
    <div class="stat-item__value">3</div>
    <div class="stat-item__label">省份</div>
  </div>
  <div class="stat-item">
    <div class="stat-item__value">20+</div>
    <div class="stat-item__label">景点</div>
  </div>
</div>

## 7 天概览

<div class="overview-cards">
  <div class="overview-card">
    <div class="overview-card__day">Day 1</div>
    <div class="overview-card__title">上海 → 台州</div>
    <div class="overview-card__desc">沿杭州湾南下，途经宁波，抵达台州</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 2</div>
    <div class="overview-card__title">台州周边</div>
    <div class="overview-card__desc">探索台州沿海风光</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 3</div>
    <div class="overview-card__title">台州 → 温州</div>
    <div class="overview-card__desc">沿海南下至温州</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 4</div>
    <div class="overview-card__title">温州周边</div>
    <div class="overview-card__desc">温州沿海及周边探索</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 5</div>
    <div class="overview-card__title">温州 → 福州</div>
    <div class="overview-card__desc">跨省进入福建</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 6</div>
    <div class="overview-card__title">福州周边</div>
    <div class="overview-card__desc">福州及周边沿海探索</div>
  </div>
  <div class="overview-card">
    <div class="overview-card__day">Day 7</div>
    <div class="overview-card__title">福州 → 上海</div>
    <div class="overview-card__desc">环线返程回上海</div>
  </div>
</div>
