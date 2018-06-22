<template>
  <div class="realMedia">
    <div class="realPhotoTitle flex_center_col" @click="forward('videoGallery')">
      <div class="realPhotoTitle_img titleSize">
        <i class="weui-icon-ai-video" v-show="icon_toggle"></i>
        <i class="weui-icon-ai-timer" v-show="!icon_toggle">
          <span class="flex_cen_end">{{time}}</span>
        </i>
      </div>
      <div class="font_2D pd_top_88">
        查看视频库
      </div>
    </div>
    <m-button size="large" type="primary" @click="externalVideo(0)" class="mr_bm_5" :disabled="disabledIn">车外拍摄</m-button>
    <!--<m-button size="large" type="primary" @click="externalVideo(1)" class="mr_bm_5" :disabled="disabledIn">车内拍摄</m-button>-->
    <router-link to="/views/monitoring/monitor" >
      <m-button size="large" :disabled="disabledIn">放弃</m-button>
    </router-link>
  </div>
</template>

<script>
  import wxMinxin from '../../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        icon_toggle: true,
        time: this.Countdown,
        disabledIn: false
      }
    },
    computed: {
      bindEquList () {
        return this.$store.state.bindEquList
      },
      Countdown () {
        return this.$store.getters.getCountdown
      }
    },
    methods: {
      externalVideo (index) {
        let vm = this
        let toast = vm.$Toast({
          message: `正在向后视镜<br/>发送指令`,
          iconClass: 'weui-loading',
          duration: 10000
        })
        vm.$http.post(this.$service.monitor.getTakeVideo, {
          imei: vm.bindEquList.imei, // 设备imei号码
          camera: index, // （0：前置，1：车内）
          width: '', // 640*480 320*240 1920*1080 1280*720 960*540
          height: '',
          fps: 30, // 帧率 单位:fps 30
          duration: 10 // （单位:秒 5 10 15），未指定值时，默认为10s。拍摄时长
        }).then(data => {
          if (data) {
            toast.close()
            vm.Toast.success('发送指令成功')
            vm.icon_toggle = false
            vm.time = 30
            vm.$store.commit('setCountdown', vm.time)
            vm.disabledIn = true
            vm.countDown()
          } else {
            toast.close()
          }
        }).catch(() => {
          toast.close()
        })
      },
      countDown () {
        let vm = this
        let tim = vm.$store.getters.getCountdown
        if (tim === 0) {
          vm.icon_toggle = true
          vm.disabledIn = false
        } else {
          vm.time--
          vm.$store.commit('setCountdown', vm.time)
          setTimeout(function () {
            vm.countDown()
          }, 1000)
        }
      },
      disabledVedio () {
        let vm = this
        let num = Number(vm.Countdown)
        if (num === 0) {
          vm.disabledIn = false
          vm.icon_toggle = true
        } else {
          vm.disabledIn = true
          vm.icon_toggle = false
        }
      },
      forward (page) {
        this.$router.push({name: `${page}`})
      }
    },
    watch: {
      Countdown (val) {
        this.disabledVedio()
        this.time = val
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.disabledVedio()
    }
  }
</script>
