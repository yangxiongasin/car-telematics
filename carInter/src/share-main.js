// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/style/weui.less'
import Vue from 'vue'
import App from './share-main.vue'
import components from './components'
import http from '@/utils/http'
import serviceAPI from './assets/config/service-api'
Vue.use(components)
Vue.use(http)
Vue.prototype.$service = serviceAPI

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
