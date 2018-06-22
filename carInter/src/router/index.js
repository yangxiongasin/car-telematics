import Vue from 'vue'
import Router from 'vue-router'
import routes from './config'
import store from '../store/index'
import {getPlatform} from '@/utils/assist.js'
Vue.use(Router)
const landingUrl = location.href.split('#')[0]
const basePath = process.env.NODE_ENV === 'production' ? '/weChat/' : '/'
const wkwebview = window.__wxjs_is_wkwebview
const ios = !!(getPlatform() === 'ios')
if (ios === true && wkwebview && location.pathname === basePath) {
}
const router = new Router({
  base: basePath,
  mode: 'history',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return {x: 0, y: 0}
  }
})
// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要权限认证
    const bindEquList = store.getters.getDefaultDevice
    if (!bindEquList || !bindEquList.imei) {
      let _path = '/views/monitoring/monitor'
      // let _path = '/views/selFacility'
      const userInfo = store.getters.getUserInfo
      if (userInfo && userInfo.userMobile) {
        _path = '/views/monitoring/boundEquiries'
      }
      // 选择设备
      let _params = Object.assign({}, to.query)
      next({
        path: _path,
        query: _params
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 设置title
router.afterEach((hook) => {
  setTimeout(function () {
    if (hook.meta.title) {
      document.title = hook.meta.title
    } else {
      document.title = '4G智能后视镜'
    }
  }, 0)
})

export default {router, landingUrl}
