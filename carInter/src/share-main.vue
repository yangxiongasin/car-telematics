<template>
    <div class="share">
      <keyed-people ref="keyPeople" :wxReady="wxReady" v-if="hasKeyedPeople"></keyed-people>
      <image-share v-if="hasImage" :addr="addr" ref="imageShare"></image-share>
      <path-map v-if="hasPathMap" :addr="addr"></path-map>
      <video-share v-if="hasVideo" ref="videoShare" :addr="addr"></video-share>
      <real-location ref="realLocation" v-if="hasRealLocation" :addr="addr"></real-location>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import AMap from 'AMap'
  import {addClass} from '@/utils/assist.js'
  import realLocation from './share/realLocation.vue'
  import imageShare from './share/imageShare.vue'
  import videoShare from './share/videoShare.vue'
  import pathMap from './share/pathMap.vue'
  import keyedPeople from './share/keyedPeople.vue'

  const uuidV1 = require('uuid/v4')
  const typeindex = location.href.indexOf('type=')
  const typehost = location.href.substring(typeindex + 5)

  export default {
//    mixins: [wxMinxin],
    data: function () {
      return {
        wxReady: false,
        defaultDevice: {
          address: '',
          imei: '',
          lat: 0,
          lng: 0,
          nickName: '',
          online: false,
          time: '',
          password: null
        },
        mapObj: null,
        mapMarker: null,
        addr: '',
        // 判断是哪种分享类型
        hasKeyedPeople: false, // 是否是一键接人
        hasImage: false, // 是否是分享图片
        hasVideo: false, // 是否是分享视频
        hasPathMap: false, // 是否是分享行车轨迹
        hasRealLocation: false // 是否是分享实时定位
      }
    },
    components: {
      // <my-component> 将只在父组件模板中可用
      'real-location': realLocation,
      'image-share': imageShare,
      'video-share': videoShare,
      'path-map': pathMap,
      'keyed-people': keyedPeople
    },
    computed: {
      cancelUrl () {
        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        const versionId = this.getUuid()
        return `${host}/views/monitoring/service?v=${versionId}`
      }
    },
    created () {
      let vm = this
      localStorage.setItem('share-main', true)
      const deviceCache = localStorage.getItem('setBindEquList')
      if (!deviceCache) {
        vm.goBack()
        return
      }
      vm.defaultDevice = JSON.parse(deviceCache)
      switch (typehost) {
        case 'keyPeople': vm.hasKeyedPeople = true
          document.title = '一键接人'
          break
        case 'image': vm.hasImage = true
          document.title = '查看'
          break
        case 'video': vm.hasVideo = true
          document.title = '查看'
          break
        case 'realLocation': vm.hasRealLocation = true
          document.title = '实时定位'
          break
        case 'wheelPath': vm.hasPathMap = true
          document.title = '行车轨迹'
          break
      }
      vm.initConfigData()
    },
    methods: {
      goBack () {
        location.replace(this.cancelUrl)
      },
      initConfigData () {
        const vm = this
        let permissions = [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'hideMenuItems',
          'getLocation'
        ]
        vm.$http.post(vm.$service.weixin.jsAuth, {
          url: location.href.split('#')[0]
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
              vm.wxReady = true
              switch (typehost) {
                case 'keyPeople':
                  if (vm.defaultDevice.online === true) {
                    vm.showAllNonBaseMenuItem()
                  } else {
                    vm.hideAllNonBaseMenuItem()
                  }
                  vm.$refs.keyPeople.registShare()
                  break
                case 'image':
                  vm.$refs.imageShare.shareImage()
                  break
                case 'video':
                  vm.showAllNonBaseMenuItem()
                  vm.$refs.videoShare.shareVedio()
                  break
                case 'realLocation':
                  vm.showAllNonBaseMenuItem()
                  vm.$refs.realLocation.shareRealLocation()
                  break
                case 'wheelPath':vm.pathMapShare()
                  vm.showAllNonBaseMenuItem()
                  break
              }
            })
          }
        })
      },

      getUuid () {
        return uuidV1().replace(/-/g, '')
      },

      wxShare (shareOption) {
        wx.onMenuShareAppMessage(shareOption) // 发送给朋友
        wx.onMenuShareTimeline(shareOption) // 发送给朋友圈
        wx.hideMenuItems({
          menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      },

      hideAllNonBaseMenuItem () {
        wx.hideAllNonBaseMenuItem({
          success: function () {
            console.log('已隐藏所有非基本菜单项')
          }
        })
      },

      showAllNonBaseMenuItem () {
        wx.showAllNonBaseMenuItem({
          success: function () {
            console.log('已显示所有非基本菜单项')
          }
        })
      },

      initMap (id, isOnline, longitude, latitude) {
        if (longitude !== 0 || latitude !== 0) {
          if (!longitude || !latitude) {
            return
          }
        }
        const lnglatXY = [longitude, latitude]
        const container = document.querySelector(`#${id}`)
        if (!container && !container.length) {
          return
        }
        addClass(container, 'map-location')
        let vm = this
        let online = isOnline === true
        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        let imgOnlineLink = `${host}/static/img/icon_online.png`
        let animate = 'AMAP_ANIMATION_BOUNCE'
        if (online !== true) {
          imgOnlineLink = `${host}/static/img/icon_offline.png`
          animate = 'AMAP_ANIMATION_NONE'
        }
        vm.mapObj = new AMap.Map(id, {
          center: [longitude, latitude],
          resizeEnable: true,
          zoom: 13
        })
        // 添加控制组件
        vm.mapObj.plugin(['AMap.ToolBar'], function () {
          vm.mapObj.addControl(new AMap.ToolBar())
        })
        vm.mapMarker = new AMap.Marker({
          map: vm.mapObj,
          position: [longitude, latitude], // 基点位置
          animation: animate,
          icon: new AMap.Icon({
            size: new AMap.Size(40, 40),  // 图标大小
            imageSize: new AMap.Size(40, 40),  // 图标大小
            image: imgOnlineLink,
            imageOffset: new AMap.Pixel(-9, 0)
          })
        })
        AMap.service('AMap.Geocoder', function () { // 回调函数
          // 实例化Geocoder
          vm.geocoder = new AMap.Geocoder({
            city: '010'// 城市，默认：“全国”
          })
          vm.geocoder.getAddress(lnglatXY, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              // 获得了有效的地址信息:
              vm.addr = result.regeocode.formattedAddress
            } else {
              // 获取地址不成功
              vm.Toast.error('无法获取地址')
            }
          })
        })
      }
    }
  }
</script>
