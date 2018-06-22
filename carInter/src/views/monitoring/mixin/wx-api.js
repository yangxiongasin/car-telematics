import wx from 'weixin-js-sdk'
import {getPlatform} from '@/utils/assist.js'
// const wkwebview = window.__wxjs_is_wkwebview
const platForm = getPlatform()
export default {
  data () {
    return {
      currentUrl: '',
      platForm: getPlatform(),
      ready: false,
      wxOptions: []
    }
  },
  computed: {
    wxSignature () {
      return this.$store.state.weChat.configData.signature
    },
    isWXShare () {
      return this.$store.state.route.meta.wxShare === true
    }
  },
  watch: {
    wxSignature (val) {
      if (val) {
        this.$emit('handleWXReady', val)
      }
    }
  },
  created () {
    const vm = this
    if (platForm === 'ios') {
      // ios只需要签名一次
      if (vm.wxSignature) {
        vm.$emit('handleWXReady', vm.wxSignature)
      }
    } else {
      // 安卓需要每次签名
      vm.$store.dispatch('getWXAuth')
    }
  },
  methods: {
    wxConfig (option, callBack) {
      let vm = this
      if (vm.ready === true) {
        if (callBack && typeof callBack === 'function') {
          callBack(wx)
        }
      } else {
        vm.$store.dispatch('getWXAuth')
      }
    },

    hideAllNonBaseMenuItem () {
      if (this.wxSignature) {
        wx.hideAllNonBaseMenuItem({
          success: function () {
            console.log('已隐藏所有非基本菜单项')
          }
        })
      }
    },

    showAllNonBaseMenuItem () {
      if (this.wxSignature) {
        wx.showAllNonBaseMenuItem({
          success: function () {
            console.log('已显示所有非基本菜单项')
          }
        })
      }
    },

    scanCode () {
      let vm = this
      if (vm.wxSignature) {
        wx.scanQRCode()
      } else {
        vm.Toast.warn('签名不成功,无法调用扫描功能')
      }
    },

    scanBarCode (callBack) {
      let vm = this
      if (vm.wxSignature) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          desc: 'scanQRCode desc',
          success: function (res) {
            let imei = res.resultStr
            var serial = imei.split(',')
            if (serial.length > 1) {
              imei = serial[serial.length - 1]
            } else if (serial.length === 1) {
              imei = serial[0]
            }
            if (callBack && typeof callBack === 'function') {
              callBack(imei)
            }
          }
        })
      } else {
        vm.Toast.warn('签名不成功,无法调用扫描功能')
      }
    },

    getWXLocation (callBack) {
      let vm = this
      if (vm.wxSignature) {
        wx.getLocation({
          success: function (res) {
            if (callBack && typeof callBack === 'function') {
              callBack(res.longitude, res.latitude)
            }
          },
          cancel: function (res) {
            vm.Toast.error('用户拒绝授权获取地理位置')
          }
        })
      } else {
        vm.Toast.warn('签名不成功,无法调用定位功能')
      }
    },

    wxShare (shareOption) {
      let vm = this
      if (vm.wxSignature) {
        wx.onMenuShareAppMessage(shareOption) // 发送给朋友
        wx.onMenuShareTimeline(shareOption) // 发送给朋友圈
        wx.hideMenuItems({
          menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      } else {
        vm.Toast.warn('签名不成功,无法注册分享功能')
      }
    },

    pickFriend (nickName, uuid) {
      const vm = this
      let _nickName = ''
      if (nickName) {
        _nickName = decodeURIComponent(nickName)
        nickName = encodeURIComponent(_nickName)
      } else {
        nickName = ''
      }
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      const link = `${host}/views/monitoring/service/pickFriend?serialeCode=${uuid}&nickName=${nickName}`
      const imgLink = `${host}/static/img/logo.png`
      const shareOption = {
        title: `${_nickName}让我来接您`,
        link: link,
        imgUrl: imgLink,
        desc: '我来接您了!点击这里,告诉我您在哪儿,同时还可以看到我的位置',
        success: (res) => {
          vm.Toast.success('分享成功')
          vm.$emit('pickFriendShareSuccess', uuid)
        },
        cancel: (res) => {
          vm.Toast.warn('已取消分享')
        },
        fail: (res) => {
          alert(JSON.stringify(res))
        }
      }
      vm.wxShare(shareOption)
    },

    shareVedio (snapshoot, path, nickName, uuid) {
      let vm = this
      path = encodeURIComponent(path)
      const sp = encodeURIComponent(snapshoot)
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      const link = `${host}/views/monitoring/monitor/video/videoDetail?serialeCode=${uuid}&path=${path}&sp=${sp}`
      const shareOption = {
        title: `${nickName}给您分享了视频`,
        link: link,
        imgUrl: snapshoot,
        desc: '我给您分享了视频!点击这里,可以观看视频内容',
        success: (res) => {
          vm.Toast.success('分享成功')
        },
        cancel: (res) => {
          vm.Toast.warn('已取消分享')
        },
        fail: (res) => {
          alert(JSON.stringify(res))
        }
      }
      vm.wxShare(shareOption)
    },

    shareImage (path, nickName, uuid) {
      let vm = this
      let eUpath = encodeURIComponent(path)
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      const link = `${host}/views/monitoring/monitor/imageDetail?serialeCode=${uuid}&path=${eUpath}`
      const shareOption = {
        title: `${nickName}给您分享了图片`,
        link: link,
        imgUrl: path,
        desc: '我给您分享了图片!点击这里,可以观看图片详情',
        success: (res) => {
          vm.Toast.success('分享成功')
        },
        cancel: (res) => {
          vm.Toast.warn('已取消分享')
        },
        fail: (res) => {
          alert(JSON.stringify(res))
        }
      }
      vm.wxShare(shareOption)
    },

    shareRealLocation (lat, lng, time, nickName, uuid) {
      let vm = this
      let entime = encodeURIComponent(time)
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      const link = `${host}/views/monitoring/monitor/realLocation?serialeCode=${uuid}&lat=${lat}&lng=${lng}&time=${entime}`
      const imgLink = `${host}/static/img/logo.png`
      const shareOption = {
        title: `${nickName}给您分享了实时定位`,
        link: link,
        imgUrl: imgLink,
        desc: '我给您分享了实时定位!点击这里,可以定位地址',
        success: (res) => {
          vm.Toast.success('分享成功')
        },
        cancel: (res) => {
          vm.Toast.warn('已取消分享')
        },
        fail: (res) => {
          alert(JSON.stringify(res))
        }
      }
      vm.wxShare(shareOption)
    },
    sharePathMap (routerID, startLng, startLat, endLng, endLat, nickName, uuid) {
      console.log(routerID, startLng, startLat, endLng, endLat, nickName, uuid)
      let vm = this
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      const link = `${host}/views/monitoring/monitor/wheelpath/pathMap?serialeCode=${uuid}&id=${routerID}&slat=${startLat}&slng=${startLng}&elat=${endLat}&elng=${endLng}`
      const imgLink = `${host}/static/img/logo.png`
      const shareOption = {
        title: `${nickName}给您分享了驾驶轨迹`,
        link: link,
        imgUrl: imgLink,
        desc: '我给您分享了驾驶轨迹!点击这里,可以查看驾驶轨迹',
        success: (res) => {
          vm.Toast.success('分享成功')
        },
        cancel: (res) => {
          vm.Toast.warn('已取消分享')
        },
        fail: (res) => {
          alert(JSON.stringify(res))
        }
      }
      vm.wxShare(shareOption)
    }
  }
}
