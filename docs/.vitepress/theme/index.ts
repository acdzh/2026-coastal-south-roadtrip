import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import AmapKeyInput from '../components/AmapKeyInput.vue'
import BudgetTable from '../components/BudgetTable.vue'
import ChargingPlan from '../components/ChargingPlan.vue'
import ImageGallery from '../components/ImageGallery.vue'
import OverviewMap from '../components/OverviewMap.vue'
import RouteMap from '../components/RouteMap.vue'
import SpotCard from '../components/SpotCard.vue'
import Timeline from '../components/Timeline.vue'

import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AmapKeyInput', AmapKeyInput)
    app.component('BudgetTable', BudgetTable)
    app.component('ChargingPlan', ChargingPlan)
    app.component('ImageGallery', ImageGallery)
    app.component('OverviewMap', OverviewMap)
    app.component('RouteMap', RouteMap)
    app.component('SpotCard', SpotCard)
    app.component('Timeline', Timeline)
  },
} satisfies Theme
