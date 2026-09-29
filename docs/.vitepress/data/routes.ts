export interface RoutePoint {
  /** 地点名称 */
  name: string
  /** 经度 */
  lng: number
  /** 纬度 */
  lat: number
  /** 地点类型 */
  type: 'start' | 'end' | 'spot' | 'food' | 'charge' | 'sleep' | 'waypoint'
  /** 描述 */
  description?: string
  /** 关联链接 */
  link?: string
}

export interface DayRoute {
  /** 第几天 */
  day: number
  /** 出发地 */
  from: string
  /** 目的地 */
  to: string
  /** 距离（公里） */
  distance: number
  /** 预计时长（分钟） */
  duration: number
  /** 途经高速 */
  highway: string
  /** 路线颜色 */
  color: string
  /** 途经点 */
  points: RoutePoint[]
}

export const routes: DayRoute[] = [
  {
    day: 1,
    from: '上海',
    to: '三门',
    distance: 335,
    duration: 282,
    highway: 'G60沪昆高速 + G1522常台高速',
    color: '#FF6B6B',
    points: [
      { name: '上海', lng: 121.4737, lat: 31.2304, type: 'start', description: '出发地', link: '/days/day1' },
      { name: '嘉绍大桥', lng: 121.05, lat: 30.45, type: 'waypoint', description: '嘉兴-绍兴跨杭州湾' },
      { name: '蛇蟠岛', lng: 121.5862, lat: 29.1421, type: 'spot', description: '海上仙子国，三门核心景点' },
      { name: '三门', lng: 121.3956, lat: 29.1051, type: 'end', description: '第一站，三门青蟹之乡', link: '/days/day1' },
    ],
  },
  {
    day: 2,
    from: '三门',
    to: '洞头',
    distance: 268,
    duration: 246,
    highway: 'G1523甬莞高速 + G228国道',
    color: '#4ECDC4',
    points: [
      { name: '三门', lng: 121.3956, lat: 29.1051, type: 'start', description: '三门县城出发', link: '/days/day2' },
      { name: '温岭石塘', lng: 121.6349, lat: 28.2868, type: 'spot', description: '浙江大陆最东端，千年曙光碑' },
      { name: '瓯江北口大桥', lng: 121.05, lat: 27.98, type: 'waypoint', description: '跨瓯江，风景极佳' },
      { name: '洞头', lng: 120.6958, lat: 27.8364, type: 'end', description: '百岛之县，海鲜天堂', link: '/days/day2' },
    ],
  },
  {
    day: 3,
    from: '洞头',
    to: '霞浦',
    distance: 233,
    duration: 228,
    highway: 'G1523甬莞高速 + G15沈海高速',
    color: '#45B7D1',
    points: [
      { name: '洞头', lng: 120.6958, lat: 27.8364, type: 'start', description: '洞头岛出发', link: '/days/day3' },
      { name: '苍南', lng: 120.4260, lat: 27.5186, type: 'waypoint', description: '马站镇小众海岸线' },
      { name: '福鼎', lng: 120.2166, lat: 27.3248, type: 'waypoint', description: '福鼎肉片、白茶故乡' },
      { name: '霞浦', lng: 120.0649, lat: 26.8777, type: 'end', description: '中国滩涂摄影圣地', link: '/days/day3' },
    ],
  },
  {
    day: 4,
    from: '霞浦',
    to: '霞浦',
    distance: 90,
    duration: 90,
    highway: '县道省道',
    color: '#96CEB4',
    points: [
      { name: '北岐滩涂', lng: 120.0649, lat: 26.8777, type: 'start', description: '日出观景台，霞浦名片', link: '/days/day4' },
      { name: '太姥山', lng: 120.1847, lat: 27.1241, type: 'spot', description: '奇石海蚀地貌，福鼎名山' },
      { name: '三沙镇', lng: 120.2259, lat: 26.9197, type: 'spot', description: '花竹村日落，东壁摄影点' },
      { name: '北岐滩涂', lng: 120.0649, lat: 26.8777, type: 'end', description: '环线返回霞浦', link: '/days/day4' },
    ],
  },
  {
    day: 5,
    from: '霞浦',
    to: '武夷山',
    distance: 309,
    duration: 240,
    highway: 'G15沈海高速 + G1514宁上高速',
    color: '#FFEAA7',
    points: [
      { name: '霞浦', lng: 120.0649, lat: 26.8777, type: 'start', description: '告别沿海，转向内陆', link: '/days/day5' },
      { name: '宁德', lng: 119.5271, lat: 26.6656, type: 'waypoint', description: 'G15转G1514枢纽' },
      { name: '武夷山', lng: 117.9597, lat: 27.6564, type: 'end', description: '世界双遗产，岩茶之乡', link: '/days/day5' },
    ],
  },
  {
    day: 6,
    from: '武夷山',
    to: '衢州',
    distance: 218,
    duration: 168,
    highway: 'G1514宁上高速 + G60沪昆高速',
    color: '#DDA0DD',
    points: [
      { name: '武夷山', lng: 117.9597, lat: 27.6564, type: 'start', description: '回程第一站', link: '/days/day6' },
      { name: '江山市', lng: 118.6269, lat: 28.7377, type: 'waypoint', description: '闽浙赣交界' },
      { name: '衢州', lng: 118.8593, lat: 28.9569, type: 'end', description: '南孔圣地，三头一掌', link: '/days/day6' },
    ],
  },
  {
    day: 7,
    from: '衢州',
    to: '上海',
    distance: 407,
    duration: 318,
    highway: 'G60沪昆高速',
    color: '#FF9FF3',
    points: [
      { name: '衢州', lng: 118.8593, lat: 28.9569, type: 'start', description: '回程最后一天', link: '/days/day7' },
      { name: '金华', lng: 119.6495, lat: 29.0895, type: 'waypoint', description: '途经，可补电休息' },
      { name: '杭州绕城', lng: 120.1536, lat: 30.2875, type: 'waypoint', description: '传统堵点，争取中午前通过' },
      { name: '上海', lng: 121.4737, lat: 31.2304, type: 'end', description: '回家！', link: '/days/day7' },
    ],
  },
]
