# 进度追踪

## Phase 1a: VitePress 脚手架
- [x] 项目初始化、依赖安装
- [x] VitePress config
- [x] 所有 Vue 组件
- [x] GitHub Actions CI
- [x] 自定义主题

## Phase 1b: 小红书搜索 — 专题类
- [x] 睡车装备、车中泊攻略（63条）
- [x] 电车充电、国庆避堵（126条）
- [x] 浙闽沿海小众景点总览（63条）
- [x] 实用信息类搜索（91条）
- 注：xhs read 被限流，帖子正文缺失，仅有标题/URL/点赞/封面图

## Phase 1c: 天气 + 应急信息
- [x] 浙江/福建 10 月初历史天气
- [x] 沿途 9 城市三甲医院
- [x] 救援电话、充电桩客服

## Phase 2: 路线规划
- [x] 7 天环线路线规划（amap-gui 实际数据）
- [x] 总距离 1860km
- [x] 去程5天沿海：上海→三门→石塘→洞头→霞浦→武夷山
- [x] 回程2天内陆：武夷山→衢州→上海

## Phase 3: 按城市搜索
- [x] 三门+温岭（90条）
- [x] 洞头+苍南（215条）
- [x] 福鼎+霞浦（90条）
- [x] 武夷山+衢州+回程避堵（97条）
- 注：同样受 xhs read 限流影响，仅有搜索元数据

## Phase 4: 整合 + 写入内容
- [x] 首页 index.md 更新
- [x] config.ts 侧边栏更新
- [x] routes.ts 路线坐标数据填充
- [x] Day 1-7 全部行程（4129行总计）
- [x] guide/preparation.md
- [x] guide/sleep-guide.md
- [x] guide/food-guide.md
- [x] guide/budget.md
- [x] guide/emergency.md
- [x] VitePress 构建验证通过

## Phase 5: 图片 + 打磨
- [x] 下载小红书图片到 public/images/（38张，覆盖8城市）
- [x] amap-gui 截取路线总览截图（overview.png）
- [x] SpotCard image 属性补全（Day 1/2/5/6）
- [x] 检查所有链接（276条小红书链接格式正确）
- [x] VitePress 构建验证通过
- [ ] npm run dev 预览验证（需用户本地查看）
- [ ] 移动端适配检查（需用户本地查看）
