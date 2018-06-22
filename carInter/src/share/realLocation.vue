<template>
    <div class="realLocation">
      <div class="realLocation_map img_100">
        <div id="map-container" :style="{'height': mapHeight + 'px'}"  ref="queryContainer">
        </div>
      </div>
      <div class="realLocation_message" ref="positionInfo">
        <div class="realLocation_time_icon flex_wrap_bet">
          <div class="realLocation_time font_7B_75">{{time}}</div>
        </div>
        <div class="realLocation_address mr_top_5 weui-flex">
        <span class="realLocation_dingwei">
          <i class="weui-icon-ai-map-marker"></i>
        </span>
          <span class="realLocation_addr font_2D_1">
          {{addr}}
        </span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        // realLocation
        rlMess: '',
        mapHeight: 0,
        defaultDevice: {},
        userInfo: {},
        time: '',
        lng: '',
        lat: ''
      }
    },
    props: {
      addr: {
        type: String,
        default: ''
      }
    },
    methods: {
      equOnlinStatus () {
        const vm = this
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.defaultDevice.imei
        }).then((data) => {
          if (data) {
            let isOnline = !!data.data.online
            vm.$parent.initMap('map-container', isOnline, vm.lng, vm.lat)
            vm.setMapHeight()
          }
        })
      },
      getRealLocation () {
        let vm = this
        vm.$http.post(this.$service.monitor.takeLac, {
          imei: vm.defaultDevice.imei
        }).then(data => {
          if (data) {
            vm.locationError = false
            vm.rlMess = data.data
            vm.time = new Date().toLocaleString()
            vm.lng = data.data.lng
            vm.lat = data.data.lat
            vm.equOnlinStatus()
          } else {
            vm.Toast.error('实时定位不成功')
          }
        }).catch(error => {
          console.log(error)
          vm.Toast.error('实时定位不成功')
        })
      },
      setMapHeight () {
        if (this.$refs.positionInfo) {
          this.mapHeight = window.innerHeight - this.$refs.positionInfo.clientHeight - 80
        }
      },
      shareRealLocation () {
        let vm = this
        const uuid = vm.$parent.getUuid()
        let entime = encodeURIComponent(vm.time)
        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        const link = `${host}/views/monitoring/monitor/realLocation?serialeCode=${uuid}&&lat=${vm.lat}&lng=${vm.lng}&time=${entime}`
        const imgLink = `${host}/static/img/logo.png`
        const shareOption = {
          title: `${vm.userInfo.nickName}给您分享了实时定位`,
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
        vm.getRealLocation()
      }
      vm.userInfo = JSON.parse(userCache)
    }
  }
</script>
