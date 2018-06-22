<template>
  <div class="boundEquiries">
    <div class="boundEquiriesTitle flex_center_col">
      <div class="boundEquiriesTitle_img">
        <i class="weui-icon-ai-rearview-mirror"></i>
      </div>
      <div class="font_2D">
        绑定设备
      </div>
      <div class="pd_top_88">
        <span class="font_7B_88">打开后视镜，扫描【关于】中的二维码</span>
      </div>
    </div>
    <m-button size="large" type="default" @click="bindingNew">绑定新设备</m-button>
    <m-button size="large" type="default" class="mr_bm_5" @click="lookBinding($service.userInfo.equBind)">查看绑定流程</m-button>
    <m-button size="large" @click="goBack">知道了</m-button>
  </div>
</template>

<script>
  import wxMinxin from './mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        icon_toggle: true,
        disabled: false
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    methods: {
      goBack () {
        this.$router.back(-1)
      },
      bindingNew () {
        let vm = this
        vm.scanCode()
      },
      // 查看绑定流程
      lookBinding (item) {
        let vm = this
        this.$http.post(item, null).then(data => {
          let msg = data.data
          vm.$router.push({name: 'userDetail', params: {id: msg}})
        })
      },
      externalPhoto () {
        let vm = this
        let bindEquList = this.$store.getters.getDefaultDevice
        let toast = vm.$Toast({
          message: `正在向后视镜<br/>发送指令`,
          iconClass: 'weui-loading',
          duration: 10000
        })
        vm.$http.post(this.$service.monitor.getTakePhoto, {
          imei: bindEquList.imei, // 设备imei号码
          camera: 0, // （0：前置，1：车内）
          width: '', // 640*480 320*240 1920*1080 1280*720 960*540
          height: ''
        }).then(data => {
          toast.close()
          if (data !== null) {
            vm.$Toast({
              message: data.resultDesc,
              iconClass: 'weui-icon-error',
              duration: 800
            })
            vm.icon_toggle = false
          }
        })
      }
    }
  }
</script>
