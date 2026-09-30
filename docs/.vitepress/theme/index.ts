import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AmapKeyInput from '../components/AmapKeyInput.vue'
import RouteMap from '../components/RouteMap.vue'
import OverviewMap from '../components/OverviewMap.vue'
import SpotCard from '../components/SpotCard.vue'
import Timeline from '../components/Timeline.vue'
import ImageGallery from '../components/ImageGallery.vue'
import BudgetTable from '../components/BudgetTable.vue'
import ChargingPlan from '../components/ChargingPlan.vue'
import Countdown from '../components/Countdown.vue'
import LocationMap from '../components/LocationMap.vue'
import DaySummary from '../components/DaySummary.vue'
import Checklist from '../components/Checklist.vue'
import FullMap from '../components/FullMap.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AmapKeyInput', AmapKeyInput)
    app.component('RouteMap', RouteMap)
    app.component('OverviewMap', OverviewMap)
    app.component('SpotCard', SpotCard)
    app.component('Timeline', Timeline)
    app.component('ImageGallery', ImageGallery)
    app.component('BudgetTable', BudgetTable)
    app.component('ChargingPlan', ChargingPlan)
    app.component('Countdown', Countdown)
    app.component('LocationMap', LocationMap)
    app.component('DaySummary', DaySummary)
    app.component('Checklist', Checklist)
    app.component('FullMap', FullMap)
  }
} satisfies Theme
