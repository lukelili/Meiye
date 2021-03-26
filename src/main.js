import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/styles/index.css'
import dateformat from 'dateformat'
import qs from 'qs'
import request from '@/utils/request'
import * as echarts from 'echarts'
import '@/assets/reset.css'

Vue.prototype.$dateformat = dateformat
Vue.prototype.$http = request
Vue.prototype.$echarts = echarts
Vue.prototype.$qs = qs
Vue.use(Antd)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
