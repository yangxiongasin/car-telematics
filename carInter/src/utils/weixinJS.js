/**
 * Created by summer on 2017/10/26.
 * 封装微信功能为插件
 */
import wx from 'weixin-js-sdk'
import service from '../assets/config/service-api'
import http from './http'
/**
 * checkJsApi: 判断当前客户端是否支持指定JS接口
 * onMenuShareTimeline: 分享到朋友圈
 * onMenuShareAppMessage: 分享给朋友
 * getNetworkType: 获取网络状态接口
 * openLocation: 使用微信内置地图查看位置接口
 * getLocation: 获取地理位置接口
 * scanQRCode:  扫一扫(直接返回结果)
 * @param http
 */
function configWx (url, option, callBack) {
  let permissions = JSON.stringify([
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'getLocation',
    'scanQRCode'
  ])
  if (option) {
    permissions = JSON.stringify(option)
  }
  if (!url) {
    alert('请输入签名url')
  }
  http.post(service.weixin.jsAuth, {
    url: url
  }).then(res => {
    if (res.data) {
      wx.config({
        debug: true,
        appId: res.data.appid,
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
        jsApiList: permissions
      })
      if (callBack && typeof callBack === 'function') {
        wx.ready(() => {
          console.log('wechat ready')
          callBack()
        })
      }
    }
  })
  wx.error(function (err) {
    alert('签名不成功')
    console.log(err)
    // alert('签名不成功:' + JSON.stringify(err))
  })
}
const install = function (Vue, http) {
  // initWX(http)
  Vue.prototype.$wx = wx
  Vue.wx = wx
}

export default Object.assign(wx, {install}, {configWx: configWx})
