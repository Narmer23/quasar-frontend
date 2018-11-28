import MillisecondsToTimeString from 'src/filters/MillisecondsToTimeString'
import Number from 'src/filters/Number'
import VueMoment from 'vue-moment'
import VueClipboard from 'vue-clipboard2'

export default ({ app, store, Vue }) => {
  app.filters = { MillisecondsToTimeString, Number }
  Vue.use(VueMoment)
  Vue.use(VueClipboard)

}
