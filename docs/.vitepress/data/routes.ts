export interface RoutePoint {
  name: string
  lng: number
  lat: number
  type: 'start' | 'end' | 'spot' | 'food' | 'charge' | 'sleep' | 'waypoint'
  description?: string
  link?: string
}

export interface DayRoute {
  day: number
  from: string
  to: string
  distance: number
  duration: number
  highway: string
  color: string
  points: RoutePoint[]
}

export const routes: DayRoute[] = [
  {
    day: 1,
    from: '上海',
    to: '台州石塘半岛',
    distance: 432,
    duration: 378,
    highway: 'G60→G1522→G15→G1523',
    color: '#4CAF50',
    points: [
      { name: '上海', lng: 121.4737, lat: 31.2304, type: 'start', link: '/days/day1' },
      { name: '嘉兴服务区', lng: 120.7555, lat: 30.7469, type: 'waypoint' },
      { name: '宁波', lng: 121.5440, lat: 29.8683, type: 'waypoint' },
      { name: '三门', lng: 121.3917, lat: 29.1050, type: 'waypoint' },
      { name: '石塘半岛', lng: 121.6073, lat: 28.3264, type: 'end', description: '中国大陆新千年第一缕曙光照射地', link: '/days/day1#核心目的地-石塘半岛' },
    ]
  },
  {
    day: 2,
    from: '石塘半岛',
    to: '温州洞头岛',
    distance: 157,
    duration: 162,
    highway: 'G1523→G15',
    color: '#2196F3',
    points: [
      { name: '石塘半岛', lng: 121.6073, lat: 28.3264, type: 'start', link: '/days/day2' },
      { name: '千年曙光碑', lng: 121.6120, lat: 28.3300, type: 'spot', description: '中国大陆新千年第一缕曙光纪念碑' },
      { name: '玉环', lng: 121.2316, lat: 28.1359, type: 'waypoint' },
      { name: '乐清', lng: 120.9833, lat: 28.1166, type: 'waypoint' },
      { name: '洞头岛', lng: 121.1578, lat: 27.8364, type: 'end', description: '百岛之县，海鲜物美价廉', link: '/days/day2#核心目的地-洞头岛' },
    ]
  },
  {
    day: 3,
    from: '洞头岛',
    to: '福鼎太姥山镇',
    distance: 183,
    duration: 174,
    highway: 'G1523→G15',
    color: '#FF9800',
    points: [
      { name: '洞头岛', lng: 121.1578, lat: 27.8364, type: 'start', link: '/days/day3' },
      { name: '苍南渔寮', lng: 120.7185, lat: 27.3052, type: 'spot', description: '浙江最大天然沙滩' },
      { name: '福鼎', lng: 120.2166, lat: 27.3243, type: 'waypoint' },
      { name: '太姥山镇', lng: 120.1388, lat: 27.1858, type: 'end', description: '太姥山下的小镇', link: '/days/day3#核心目的地-太姥山镇' },
    ]
  },
  {
    day: 4,
    from: '太姥山镇',
    to: '霞浦三沙镇',
    distance: 72,
    duration: 66,
    highway: '228国道',
    color: '#9C27B0',
    points: [
      { name: '太姥山镇', lng: 120.1388, lat: 27.1858, type: 'start', link: '/days/day4' },
      { name: '牛郎岗海滨', lng: 120.1886, lat: 27.2150, type: 'spot', description: '福鼎牛郎岗海滨度假区' },
      { name: '小皓沙滩', lng: 120.0982, lat: 26.8640, type: 'spot', description: '霞浦经典摄影点，日落绝佳' },
      { name: '东壁村', lng: 120.0750, lat: 26.8500, type: 'spot', description: '霞浦日落摄影圣地' },
      { name: '三沙镇', lng: 120.0731, lat: 26.8830, type: 'end', description: '霞浦摄影核心区域', link: '/days/day4#核心目的地-霞浦三沙' },
    ]
  },
  {
    day: 5,
    from: '霞浦三沙',
    to: '福州',
    distance: 184,
    duration: 162,
    highway: 'G15→G1505',
    color: '#F44336',
    points: [
      { name: '三沙镇', lng: 120.0731, lat: 26.8830, type: 'start', link: '/days/day5' },
      { name: '北岐滩涂', lng: 120.0150, lat: 26.8800, type: 'spot', description: '国内最美滩涂，日出摄影点' },
      { name: '宁德', lng: 119.5477, lat: 26.6654, type: 'waypoint' },
      { name: '连江', lng: 119.5394, lat: 26.1975, type: 'waypoint' },
      { name: '福州三坊七巷', lng: 119.2965, lat: 26.0839, type: 'end', description: '中国历史文化名街', link: '/days/day5#核心目的地-福州' },
    ]
  },
  {
    day: 6,
    from: '福州',
    to: '衢州',
    distance: 468,
    duration: 372,
    highway: 'G1505→G3 京台高速',
    color: '#607D8B',
    points: [
      { name: '福州', lng: 119.2965, lat: 26.0839, type: 'start', link: '/days/day6' },
      { name: '南平', lng: 118.1777, lat: 26.6419, type: 'waypoint' },
      { name: '武夷山', lng: 118.0356, lat: 27.7539, type: 'waypoint' },
      { name: '江山', lng: 118.6269, lat: 28.7375, type: 'waypoint' },
      { name: '衢州', lng: 118.8747, lat: 28.9357, type: 'end', description: '水亭门历史街区，三头一掌', link: '/days/day6' },
    ]
  },
  {
    day: 7,
    from: '衢州',
    to: '上海',
    distance: 407,
    duration: 318,
    highway: 'G60 沪昆高速',
    color: '#795548',
    points: [
      { name: '衢州', lng: 118.8747, lat: 28.9357, type: 'start', link: '/days/day7' },
      { name: '金华', lng: 119.6471, lat: 29.0787, type: 'waypoint' },
      { name: '义乌', lng: 120.0750, lat: 29.3062, type: 'waypoint' },
      { name: '杭州', lng: 120.1551, lat: 30.2741, type: 'waypoint' },
      { name: '上海', lng: 121.4737, lat: 31.2304, type: 'end', link: '/days/day7' },
    ]
  },
]

// ============================================================
// 备选路线
// ============================================================

// Day 1 备选：上海→三门（比石塘近100km，适合不想第一天开太远）
export const altRouteDay1Sanmen: DayRoute = {
  day: 1,
  from: '上海',
  to: '三门',
  distance: 335,
  duration: 282,
  highway: 'G60沪昆高速 + G1522常台高速',
  color: '#FF6B6B',
  points: [
    { name: '上海', lng: 121.4737, lat: 31.2304, type: 'start' },
    { name: '嘉绍大桥', lng: 121.05, lat: 30.45, type: 'waypoint', description: '嘉兴-绍兴跨杭州湾' },
    { name: '蛇蟠岛', lng: 121.5862, lat: 29.1421, type: 'spot', description: '海上仙子国，三门核心景点' },
    { name: '三门', lng: 121.3956, lat: 29.1051, type: 'end', description: '三门青蟹之乡' },
  ],
}

// Day 5 备选：霞浦→武夷山（替代霞浦→福州，适合对山景/岩茶感兴趣）
export const altRouteDay5Wuyishan: DayRoute = {
  day: 5,
  from: '霞浦',
  to: '武夷山',
  distance: 309,
  duration: 240,
  highway: 'G15沈海高速 + G1514宁上高速',
  color: '#FFEAA7',
  points: [
    { name: '霞浦', lng: 120.0649, lat: 26.8777, type: 'start' },
    { name: '宁德', lng: 119.5271, lat: 26.6656, type: 'waypoint' },
    { name: '武夷山', lng: 117.9597, lat: 27.6564, type: 'end', description: '世界双遗产，岩茶之乡' },
  ],
}

// Day 5 备选：福州→平潭岛（福州出发当日往返或过夜，约120km/1.5h单程）
export const altRouteDay5Pingtan: DayRoute = {
  day: 5,
  from: '福州',
  to: '平潭岛',
  distance: 120,
  duration: 90,
  highway: 'G15沈海高速 → 平潭海峡大桥',
  color: '#00BCD4',
  points: [
    { name: '福州', lng: 119.2965, lat: 26.0839, type: 'start' },
    { name: '平潭海峡大桥', lng: 119.5800, lat: 25.7500, type: 'waypoint', description: '中国最长跨海大桥之一' },
    { name: '龙凤头海滩', lng: 119.7900, lat: 25.5200, type: 'spot', description: '平潭最知名沙滩' },
    { name: '北港村', lng: 119.8200, lat: 25.5500, type: 'spot', description: '石头厝文创村' },
    { name: '平潭岛', lng: 119.7908, lat: 25.5036, type: 'end', description: '离台湾最近的岛，蓝眼泪圣地' },
  ],
}

// 延伸备选：福州→厦门（单程约260km/3h，适合多请1-2天假的情况）
export const altRouteExtendXiamen: DayRoute = {
  day: 5,
  from: '福州',
  to: '厦门',
  distance: 260,
  duration: 180,
  highway: 'G15沈海高速',
  color: '#E91E63',
  points: [
    { name: '福州', lng: 119.2965, lat: 26.0839, type: 'start' },
    { name: '莆田', lng: 119.0078, lat: 25.4540, type: 'waypoint', description: '妈祖故里' },
    { name: '泉州', lng: 118.5894, lat: 24.9085, type: 'spot', description: '世遗之城，闽南文化中心' },
    { name: '厦门鼓浪屿', lng: 118.0644, lat: 24.4488, type: 'end', description: '万国建筑博览+闽南小吃天堂' },
  ],
}

// Day 6 备选：武夷山→衢州（配合 Day 5 武夷山方向）
export const altRouteDay6WuyishanQuzhou: DayRoute = {
  day: 6,
  from: '武夷山',
  to: '衢州',
  distance: 218,
  duration: 168,
  highway: 'G1514宁上高速 + G60沪昆高速',
  color: '#DDA0DD',
  points: [
    { name: '武夷山', lng: 117.9597, lat: 27.6564, type: 'start' },
    { name: '江山市', lng: 118.6269, lat: 28.7375, type: 'waypoint', description: '闽浙赣交界' },
    { name: '衢州', lng: 118.8593, lat: 28.9569, type: 'end', description: '南孔圣地，三头一掌' },
  ],
}
