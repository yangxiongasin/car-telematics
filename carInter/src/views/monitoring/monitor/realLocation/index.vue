<template>
    <div class="realLocation" >
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
  import wxMinxin from '../../mixin/wx-api'
  import mapMixin from '../../mixin/map-position'
  const uuid = require('uuid/v4')
  export default {
    name: '',
    mixins: [wxMinxin, mapMixin],
    data () {
      return {
        mess: '',
        mapHeight: 0,
        time: '',
        BindEquList: '',
        defaultDevice: {},
        userInfo: {},
        lng: '',
        lat: ''
      }
    },
    methods: {
      equOnlinStatus () {
        const vm = this
        vm.BindEquList = this.$store.getters.getDefaultDevice
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.BindEquList.imei
        }).then((data) => {
          if (data) {
            let isOnline = !!data.data.online
            this.initMap('map-container', isOnline, vm.lng, vm.lat)
            vm.setMapHeight()
          }
        })
      },
      getRealLocation () {
        let vm = this
        //        const uuid = vm.getUuid()
        vm.BindEquList = this.$store.getters.getDefaultDevice
        vm.$http.post(this.$service.monitor.takeLac, {
          imei: vm.BindEquList.imei
        }).then(data => {
          if (data) {
            vm.locationError = false
            vm.mess = data.data
            vm.time = new Date().toLocaleString()
            vm.lng = data.data.lng
            vm.lat = data.data.lat
            //            vm.shareRealLocation(vm.lat, vm.lng, vm.time, vm.userInfo.nickName, uuid)
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
      getUuid () {
        return uuid().replace(/-/g, '')
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      const vm = this
      const index = location.href.indexOf('lat=')
      if (index === -1) {
        vm.getRealLocation()
        vm.userInfo = vm.$store.getters.getUserInfo
        vm.defaultDevice = vm.$store.getters.defaultDevice
      } else {
        const href = location.href
        const latIdx = href.indexOf('lat=')
        const lngIdx = href.indexOf('lng=')
        const timeIdx = href.indexOf('time=')
        const host = decodeURIComponent(href.substring(timeIdx + 5))
        vm.time = host
        vm.lng = href.slice(lngIdx + 4, timeIdx - 1)
        vm.lat = href.slice(latIdx + 4, lngIdx - 1)
        vm.equOnlinStatus()
      }
    }
  }
</script>
