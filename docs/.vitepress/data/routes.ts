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

export const routes: DayRoute[] = []
