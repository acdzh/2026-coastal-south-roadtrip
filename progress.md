# 项目进度

## Phase 0: 准备 ✅

## Phase 1: 并行启动 ✅

### 1a: VitePress 脚手架 ✅
- 所有组件、配置、CI、占位页面就位，构建通过

### 1b: 小红书搜索 — 专题类 ✅
- 35 关键词，216 条帖子（33/35 成功）

### 1c: 天气 + 应急信息 ✅
- preparation.md 和 emergency.md 内容详细

## Phase 2: 路线规划 ✅
- 7天环线路线已确定，routes.ts 已填入坐标数据
- 总里程 ~1903km

## Phase 3: 按城市搜索 ✅
- 台州 171条 | 温州 114条 | 福鼎/霞浦 150条 | 福州 171条 | 回程 50条
- 总计 872 条帖子

## Phase 3.5: 数据增强
- [x] 图片下载：3632张，100%成功率，365MB
- [x] ADB截图收集：360条高赞帖子，1080张截图，858MB
- [ ] 🔄 OCR截图提取（5个Agent启动，台州Agent已返回但未产出有效数据）
  - 台州/温州/福鼎霞浦/福州/回程+专题 各一个Agent

## Phase 4: 整合 + 写入内容
- [ ] 🔄 Day 1 攻略写入（Agent已启动）
- [ ] 🔄 Day 2 攻略写入（Agent已启动）
- [ ] Day 3-5 攻略写入（待Agent释放后启动）
- [ ] Day 6-7 回程攻略写入（待Agent释放后启动）
- [ ] guide文件写入（sleep-guide/food-guide/budget，待启动）
- [ ] 更新首页 index.md
- [ ] 更新 VitePress config 侧边栏

## Phase 5: 图片 + 打磨
- [ ] amap-gui 截取路线截图（fallback）
- [ ] 检查链接
- [ ] npm run build 验证
- [ ] npm run dev 预览 + 移动端检查
- [ ] git commit
