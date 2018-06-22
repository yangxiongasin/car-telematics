<template>
    <div class="keyedPeople">
      <p v-if="!isOnline" class="font_7B_88" style="text-align: center;margin-top: 30px;color: #FF5961">
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
          <p>请点击右上角
            <i class="weui-icon-ai-more-and-more"></i>
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
      <router-link to="/views/monitoring/service" class="cancel_kP flex_center font_7B_113">
        <span>取消</span>
      </router-link>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import wxMinxin from '../../mixin/wx-api'
  const uuid = require('uuid/v4')
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        loading: null,
        currentUrl: '',
        serialeCode: '',
        msg: '',
        BindEquList: '',
        lng: '',
        lat: ''
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.getUserInfo
      },
      isOnline () {
        return this.$store.getters.getDefaultDevice.online === true
      },
      signate () {
        return this.$store.state.weChat.configData.signature
      }
    },
    methods: {
      keyedMe (lacType) {
        let vm = this
        if (vm.isOnline === false) {
          vm.Toast.error('设备不在线,无法使用接人功能')
          return
        }
        if (lacType === 1) { // 接朋友
          vm.$Dialog({
            message: vm.$refs.pickupFriendTxt.innerHTML,
            iconClass: 'weui-icon-warn'
          })
        } else {
          vm.getLocation(lacType)
        }
      },
      savePickUp (serialeCode) {
        const vm = this
        vm.$http.post(vm.$service.service.savePickUp, {
          serialeCode: serialeCode,
          imei: vm.$store.getters.getDefaultDevice.imei
        }).then((data) => {
          if (data) {
            vm.serialeCode = vm.getUuid()
          }
        })
      },
      getNavi (lacType) {
        let vm = this
        vm.BindEquList = this.$store.getters.getDefaultDevice
        vm.$http.post(vm.$service.service.getNavi, {
          imei: vm.BindEquList.imei,
          lacType: lacType, // 1代表接人指令，3代表导航指令
          lng: vm.lng, // 目的地经度(119.234521)百度坐标
          lat: vm.lat // 目的地纬度(23.387612)百度坐标
        }).then(data => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
          if (data === null) {
            return
          }
          if (data !== null) {
            vm.$Toast({
              message: `指令已发送</br>请等待车辆来接`,
              iconClass: 'weui-icon-success',
              duration: 1000
            })
          } else {
            vm.$Toast({
              message: `<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
                          设备不在线
                        </span></br>
                        <span>无法使用接人功能</span>`,
              iconClass: 'weui-icon-error',
              duration: 1000
            })
          }
        }).catch(() => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
        })
      },
      getUuid () {
        return uuid().replace(/-/g, '')
      },
      share () {
        const vm = this
        const nickName = encodeURIComponent(vm.userInfo.nickName)
        const uuid = vm.getUuid()
        vm.pickFriend(nickName, uuid)
      },
      // 获取当前经纬度
      getLocation (lacType) {
        let vm = this
        if (!vm.wxSignature) {
          this.Toast.warn('还在定位您当前位置, 请稍后再试')
          return
        }
        //        vm.loading = vm.Toast.loading('正在发送指令...')
        vm.loading = vm.$Toast({
          message: '正在发送指令...',
          iconClass: 'weui-icon_toast weui-loading',
          duration: 10000
        })
        wx.getLocation({
          success: function (res) {
            vm.lng = res.longitude
            vm.lat = res.latitude
            vm.getNavi(lacType)
          },
          cancel: function (res) {
            vm.Toast.error('用户拒绝授权获取地理位置')
            if (vm.loading) {
              vm.loading.close()
              vm.loading = null
            }
          }
        })
      }
    },
    mounted () {
      const vm = this
      const imei = this.$store.getters.getDefaultDevice.imei
      if (imei) {
        vm.$store.dispatch('equOnlinStatus')
      }
    },
    beforeDestroy () {
      const vm = this
      if (vm.loading) {
        vm.loading.close()
        vm.loading = null
      }
    },
    beforeCreate () {
      const vm = this
      vm.$on('handleWXReady', () => {
        vm.share()
        if (vm.isOnline) {
          vm.showAllNonBaseMenuItem()
        } else {
          vm.hideAllNonBaseMenuItem()
        }
      })
      vm.$on('pickFriendShareSuccess', (uuid) => {
        vm.savePickUp(uuid)
      })
    }
  }
</script>
