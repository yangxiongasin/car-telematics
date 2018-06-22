import Vuex from 'vuex'
import Vue from 'vue'
import http from '../utils/http'
import service from '../assets/config/service-api'
import wx from 'weixin-js-sdk'

Vue.use(Vuex)
Vue.use(http)
const BindEqulist = {
  address: '',
  default: false,
  imei: '',
  lat: 0,
  lng: 0,
  nickName: '',
  online: false,
  time: '',
  password: null
}
let wxErrorTime = 0
const store = new Vuex.Store({
  state: {
    rootUrl: '',
    noDevice: false,
    weChat: {
      ready: null,
      configData: {
        signature: ''
      }
    },
    installServiceDetails: '',
    bindEquList: Object.assign({}, BindEqulist), // 用户默认绑定的设备
    bindEquListAll: [], // 用户下所有绑定的设备
    equModelsAds: [], // 广告图片查询接口数据
    userInfo: {
      city: '',
      country: '',
      province: '',
      headPortrait: '',
      nickName: '',
      qrscene: '',
      sex: '',
      userId: '',
      userMobile: '',
      userName: ''
    }, // 用户信息
    // 手机验证码
    PhoneVerificationCode: {
      code: '',
      desc: ''
    },
    mobileAds: {},
    SelectEqui: Object.assign({}, BindEqulist),
    ParamsDate: '',
    Countdown: '0',
    installInfo: ''
  },
  getters: {
    getRootUrl (state) {
      if (state.rootUrl) {
        return state.rootUrl.split('#')[0]
      } else {
        return ''
      }
    },
    getDefaultDevice (state) {
      const cache = localStorage.getItem('setBindEquList')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.bindEquList.imei) {
        return state.bindEquList
      } else {
        return cacheData
      }
    },
    getUserInfo (state) {
      const cache = localStorage.getItem('setUserInfo')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.userInfo.nickName) {
        return state.userInfo
      } else {
        return cacheData
      }
    },
    getAllBindEquList (state) {
      const cache = localStorage.getItem('setAllBindEquList')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.bindEquListAll && state.bindEquListAll.length) {
        return state.bindEquListAll
      } else {
        return cacheData
      }
    },
    getCountdown (state) {
      const cache = localStorage.getItem('Countdown')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.Countdown) {
        return state.Countdown
      } else {
        return cacheData
      }
    },
    getInstallInfo (state) {
      const cache = localStorage.getItem('installInfo')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.installInfo) {
        console.log(state.installInfo)
        return state.installInfo
      } else {
        console.log(cacheData)
        return cacheData
      }
    }
  },
  mutations: {
    // 广告图片查询接口数据
    setEquModelsAds (state, data) {
      state.equModelsAds = data
    },
    // 用户下所有的设备
    setBindEquListAll (state, data) {
      state.bindEquListAll = data || []
      localStorage.setItem('setAllBindEquList', data ? JSON.stringify(data) : '')
    },
    // 用户已绑定的设备
    setBindEquList (state, data) {
      if (data === null) {
        state.bindEquList = Object.assign({}, BindEqulist)
        state.bindEquList.imei = null
      } else {
        state.bindEquList = data
      }
      localStorage.setItem('setBindEquList', JSON.stringify(state.bindEquList))
    },
    // 用户信息
    setUserInfo (state, data) {
      state.userInfo = data
      localStorage.setItem('setUserInfo', data ? JSON.stringify(data) : '')
    },
    setISDdata (state, {list}) { // 存储操作员登录信息
      state.installServiceDetails = list
    },
    // 设置手机验证码
    SetPhoneVerificationCode (state, {list}) {
      state.PhoneVerificationCode.code = list.resultCode
      state.PhoneVerificationCode.desc = list.resultDesc
    },
    setMobileAds (state, {list}) {
      state.mobileAds = list
    },
    setRootUrl (state, url) {
      state.rootUrl = url || ''
    },
    setSelectEqui (state, item) {
      state.SelectEqui = item
    },
    setParamsDate (state, item) {
      state.ParamsDate = item
    },
    setCountdown (state, item) {
      if (item >= 0) {
        state.Countdown = item
        localStorage.setItem('Countdown', item)
      }
    },
    setOnline (state, online) {
      state.bindEquList.online = online
    },
    setSelectedOnline (state, online) {
      state.SelectEqui.online = online
    },
    setWechat (state, option) {
      if (option) {
        state.weChat = option
      } else {
        state.weChat = {
          ready: false,
          configData: {
            signature: ''
          }
        }
      }
    },
    setNodevice (state, flag) {
      state.noDevice = flag
    },
    setInstallInfo (state, data) {
      state.installInfo = data
      localStorage.setItem('installInfo', data ? JSON.stringify(data) : '')
    }
  },
  actions: {
    getISDdata (context) {
      let vm = this
      vm.$http.post(service.service.freeInstall.getStoreData).then(data => {
        context.commit('setISDdata', { list: data })
      })
    },
    // 获取手机验证码接口
    GetPhoneVerificationCode (context, param) {
      // let vm = this
      http.post(service.GetPhoneVerificationCode, {
        phone: param,
        smsType: '1'
      }).then(data => {
        context.commit('SetPhoneVerificationCode', { list: data })
      })
    },
    // 获取广告图片
    getSwipeData (context) {
      http.post(service.monitor.getMobileAds, {}).then(data => {
        // 设置广告图片信息到store
        context.commit('setEquModelsAds', data.data || [])
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取用户信息
    getUserInfo (context) {
      http.post(service.userInfoo, {}).then(data => {
        // 设置用户信息到store
        context.commit('setUserInfo', data.data)
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取设备列表
    getBindEquList (context, notQueryPass) {
      http.post(service.getBindEquList, {}).then(data => {
        if (data && data.data && data.data.length) {
          context.commit('setBindEquListAll', data.data)
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].default === true) {
              data.data[i].password = null
              context.commit('setBindEquList', data.data[i])
              context.dispatch('equOnlinStatus')
              if (!notQueryPass) {
                context.dispatch('inputEquPwdFalg', data.data[i].imei)
              }
            }
          }
        } else {
          context.commit('setNodevice', true)
          context.commit('setBindEquList', null)
          context.commit('setBindEquListAll', null)
        }
      })
    },
    // 查看设备是否需要密码
    inputEquPwdFalg (context, imei) {
      http.post(service.inputEquPwdFalg, {
        imei: imei || context.getters.getDefaultDevice.imei,
        operType: 3
      }).then(data => {
        if (data.data !== null) {
          let _device = Object.assign({}, context.state.bindEquList)
          _device.password = data.data
          context.commit('setBindEquList', _device)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 设备在线状态检查
    equOnlinStatus (context, imei) {
      imei = imei || context.getters.getDefaultDevice.imei
      http.post(service.equOnlinStatus, {
        imei: imei
      }).then((data) => {
        if (data && data.data) {
          if (imei === context.state.bindEquList.imei) {
            context.commit('setOnline', !!data.data.online)
          }
          if (imei === context.state.SelectEqui.imei) {
            context.commit('setSelectedOnline', !!data.data.online)
          }
        }
      })
    },
    // 获取微信认证
    getWXAuth (context) {
      let _url = location.href.split('#')[0]
      // let _url = 'http://test.che.ge.chinamobile.com/weChat/'
      let permissions = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'hideMenuItems',
        'getLocation',
        'scanQRCode'
      ]
      http.post(service.weixin.jsAuth, {
        url: _url
      }).then(res => {
        if (res.data) {
          let configData = res.data
          configData.jsApiList = permissions
          wx.config({
            debug: false,
            appId: configData.appid,
            timestamp: configData.timestamp,
            nonceStr: configData.nonceStr,
            signature: configData.signature,
            jsApiList: configData.jsApiList
          })
          wx.ready(() => {
            console.log('wechat ready')
            context.commit('setWechat', {ready: true, configData: configData})
          })
          wx.error(function (err) {
            // alert('签名不成功')
            console.log(err)
            if (wxErrorTime === 0) {
              context.commit('setWechat', null)
            }
          })
        }
      })
    }
  }
})

export default store
