// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/style/weui.less'
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import routerObj from './router'
import components from './components'
import http from './utils/http'
import serviceAPI from './assets/config/service-api'
import store from './store/index'
import VueClipboard from 'vue-clipboard2'
Vue.config.productionTip = false
// Vue.config.silent = true // 取消所有Vue的提示与警告
Vue.use(components)
Vue.use(http)
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.prototype.$service = serviceAPI
const router = routerObj.router
// 将路由状态同步到store中
sync(store, router)
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
