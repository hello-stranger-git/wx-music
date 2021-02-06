import Vue from 'vue'
import App from './App'
import '@/static/css/iconfont/iconfont.css'
import '@/static/css/reset.css'
import utils from '@/utils/utils.js'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$utils = utils
const app = new Vue({
    ...App
})
app.$mount()
