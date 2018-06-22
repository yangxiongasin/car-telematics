<template>
    <div class="realMedia">
      <div class="realPhotoTitle flex_center_col" @click="forward('photoGallery')">
        <div class="realPhotoTitle_img titleSize">
          <i class="weui-icon-ai-camera" v-show="icon_toggle"></i>
          <i class="weui-icon-ai-timer" v-show="!icon_toggle">
            <span class="flex_cen_end">{{time}}</span>
          </i>
        </div>
        <div class="font_2D pd_top_88">
          查看照片库
        </div>
      </div>

      <m-button size="large" v-for="item in button_data" type="primary"
                @click="externalPhoto(item.status)" :disabled="disabledIn" :key="'btn_' + item.status">
        {{item.name}}
      </m-button>
      <m-button size="large" @click="externalPhoto(2)" :disabled="disabledIn">放弃</m-button>
    </div>
</template>

<script>
  import wxMinxin from '../../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        button_data: [
          {
            status: 0,
            name: '车外拍照'
          },
          {
            status: 1,
            name: '车内拍照'
          }
        ],
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
      // 点击页面按钮，如果为2那么跳转到monitorCar页面，否则发送指令
      externalPhoto (index) {
        let vm = this
        if (index !== 2) {
          const toast = vm.$Toast({
            message: `正在向后视镜<br/>发送指令`,
            iconClass: 'weui-loading',
            duration: 10000
          })
          vm.$http.post(this.$service.monitor.getTakePhoto, {
            imei: vm.bindEquList.imei, // 设备imei号码
            camera: index, // （0：前置，1：车内）
            width: '', // 640*480 320*240 1920*1080 1280*720 960*540
            height: ''
          }).then(data => {
            if (data) {
              toast.close()
              vm.Toast.success('发送指令成功')
              vm.icon_toggle = false
              vm.time = 15
              vm.$store.commit('setCountdown', vm.time)
              vm.disabledIn = true
              vm.countDown()
            } else {
              toast.close()
            }
          }).catch(() => {
            toast.close()
          })
        } else {
          vm.$router.push({name: 'monitorCar'})
        }
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
      forward (addr) {
        this.$router.push({name: `${addr}`})
      },
      disabledCamer () {
        let vm = this
        let num = Number(vm.Countdown)
        if (num === 0) {
          vm.disabledIn = false
          vm.icon_toggle = true
        } else {
          vm.disabledIn = true
          vm.icon_toggle = false
        }
      }
    },
    watch: {
      Countdown (val) {
        this.disabledCamer()
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
      this.disabledCamer()
    }
  }
</script>
