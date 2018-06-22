<template>
  <div class="keyedPeople">
    <p v-if="!defaultDevice.online" class="font_7B_88" style="text-align: center;margin-top: 30px;color: #FF5961">
      <m-icon type="ai-map-marker-off"></m-icon>
      设备不在线,无法使用接人功能</p>
    <div class="keyedOthers flex_center_col">
      <div class="flex_center_col" @click="keyedMe(1)">
        <div class="keyedOthers_head ">
          <i class="weui-icon-ai-face"></i>
        </div>
        <span class="font_2D keyedOthers_text">接朋友</span>
      </div>
      <div class="font_7B_88 keyedOthers_content" ref="pickupFriendTxt">
        <p>请点击右上角 <i class="weui-icon-ai-more-and-more"></i>
        </p>
        <p>分享链接给好友即可实现智能导航</p>
      </div>
    </div>
    <div class="keyedMe flex_center_col">
      <div class="flex_center_col" @click="keyedMe(3)">
        <div class="keyedMe_head img_100">
          <img v-lazy="userInfo.headPortrait">
        </div>
        <span class="font_2D keyedMe_text">接我</span>
      </div>
      <div class="font_7B_88">
        点击即可实现智能导航
      </div>
    </div>
    <a @click="goback" class="cancel_kP flex_center font_7B_113">
      <span>取消</span>
    </a>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  export default {
    name: '',
    data () {
      return {
        loading: null,
        postionXY: {
          lng: '',
          lat: ''
        },
        userInfo: {
          headPortrait: '',
          nickName: '',
          sex: ''
        },
        defaultDevice: {
          address: '',
          imei: '',
          lat: 0,
          lng: 0,
          nickName: '',
          online: false,
          time: '',
          password: null
        }
      }
    },
    props: {
      wxReady: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      goback () {
        this.$parent.goBack()
      },
      keyedMe (lacType) {
        let vm = this
        if (vm.defaultDevice.online === false) {
          vm.Toast.error('设备不在线,无法使用接人功能')
          return
        }
        if (lacType === 1) { // 接朋友
          vm.$Dialog({
            message: vm.$refs.pickupFriendTxt.innerHTML,
            iconClass: 'weui-icon-warn'
          })
        } else {
          vm.sendPosition(lacType)
        }
      },
      equOnlinStatus (context) {
        const vm = this
        const imei = vm.defaultDevice.imei
        if (!imei) {
          return
        }
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: imei
        }).then((data) => {
          if (data && data.data) {
            vm.defaultDevice.online = !!data.data.online
          } else {
            vm.defaultDevice.online = false
          }
        })
      },
      getNavi (lacType) {
        let vm = this
        vm.$http.post(vm.$service.service.getNavi, {
          imei: vm.defaultDevice.imei,
          lacType: lacType, // 1代表接人指令，3代表导航指令
          lng: vm.postionXY.lng, // 目的地经度(119.234521)百度坐标
          lat: vm.postionXY.lat // 目的地纬度(23.387612)百度坐标
        }).then(data => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
          if (data === null) {
            vm.Toast.error(`发送位置不成功</br>${data.resultDesc}`)
          } else {
            vm.Toast.success(`发送位置成功</br>请等待车辆来接`)
          }
        }).catch(() => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
        })
      },
      sendPosition (lacType) {
        let vm = this
        if (vm.wxReady === false) {
          vm.Toast.warn('还在定位您当前位置, 请稍后再试')
          return
        }
        vm.loading = vm.Toast.loading('正在发送指令...')
        wx.getLocation({
          success: function (res) {
            if (res.longitude && res.latitude) {
              vm.postionXY.lng = res.longitude
              vm.postionXY.lat = res.latitude
            }
            vm.getNavi(lacType)
          },
          cancel: function (res) {
            vm.Toast.error('用户拒绝授权获取地理位置')
          }
        })
      },
      savePickUp (serialeCode, imei) {
        const vm = this
        if (!imei) {
          vm.Toast.warn('没有imei号')
          return
        }
        vm.$http.post(vm.$service.service.savePickUp, {
          serialeCode: serialeCode,
          imei: imei
        }).then((data) => {
          if (data) {
            vm.serialeCode = vm.$parent.getUuid()
          }
        })
      },
      registShare () {
        const vm = this
        const uuid = vm.$parent.getUuid()
        const imei = vm.defaultDevice.imei
        const _nickName = decodeURIComponent(vm.userInfo.nickName)
        const nickName = encodeURIComponent(_nickName)
        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        const link = `${host}/views/monitoring/service/pickFriend?serialeCode=${uuid}&nickName=${nickName}`
        const imgLink = `${host}/static/img/logo.png`
        const shareOption = {
          title: `${_nickName}让我来接您`,
          link: link,
          imgUrl: imgLink,
          desc: '我来接您了!点击这里,告诉我您在哪儿,同时还可以看到我的位置',
          success: function (res) {
            vm.savePickUp(uuid, imei)
            vm.Toast.success('分享成功')
          },
          cancel: function (res) {
            vm.Toast.warn('已取消分享')
          },
          fail: function (res) {
            alert(JSON.stringify(res))
          }
        }
        vm.$parent.wxShare(shareOption)
      }
    },
    created () {
      let vm = this
      const deviceCache = localStorage.getItem('setBindEquList')
      if (!deviceCache) {
        alert('没有设备信息')
        return
      }
      const userCache = localStorage.getItem('setUserInfo')
      if (!userCache) {
        alert('没有用户信息')
        return
      }
      vm.defaultDevice = JSON.parse(deviceCache)
      if (vm.defaultDevice.imei) {
        vm.equOnlinStatus()
      }
      vm.userInfo = JSON.parse(userCache)
    }
  }
</script>
