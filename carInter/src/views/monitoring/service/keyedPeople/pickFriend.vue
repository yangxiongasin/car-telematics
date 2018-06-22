<template>
  <div class="pickFriend">
    <div class="map-search-wrap" ref="searchBar">
      <div class="weui-search-bar weui-search-bar_focusing" id="searchBar">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <i class="weui-icon-search"></i>
            <input type="search" v-model="mapKey"  class="weui-search-bar__input" id="searchInput" placeholder="查询地址" required="">
            <a href="javascript:" class="weui-icon-clear" id="searchClear" @click="mapKey=''"></a>
          </div>
          <label class="weui-search-bar__label" id="searchText">
            <i class="weui-icon-search"></i>
            <span>搜索</span>
          </label>
        </div>
        <!--<a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>-->
      </div>
      <div class="weui-cells searchbar-result" id="searchResult"
           style="display: block transform-origin: 0px 0px 0px opacity: 1 transform: scale(1, 1)">
        <!--<div class="weui-cell weui-cell_access">-->
        <!--<div class="weui-cell__bd weui-cell_primary">-->
        <!--<p>实时搜索文本</p>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <div id="map-container"  class="map-location"  :style="{'height': mapHeight}" ref="map"></div>
    <div class="popover-wrap" id="map-marker" ref="mapMarker">
      <div class="popover-rel"><i class="position-static-icon weui-icon-ai-map-marker"></i></div>
      <div class="popover" x-placement="top" style="top: -135px;left: -82px;position: absolute;will-change: top, left;">
        <div class="popover-arrow"></div>
        <div class="popover-content" >
          <h3 class="popover-title"></h3>
          <div class="popover-inner">
            <div class="popover-body">
              <div class="popover-body-content">
                <div class="popover-body-content-inner">
                  <p id="map-address"  class="map-address" v-text="addressText"></p>
                  <p style="text-align: center; margin: 5px auto">
                    <button class="w-full weui-btn weui-btn_primary weui-btn_mini" id="btn-sendPosition" @click="sendPosition">
                      发送位置
                    </button>
                  </p>
                  <p style="font-size: 0.5em">如定位不准确,请移动地图确定您的位置</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  import AMap from 'AMap'
  // import {getPlatform} from '@/utils/assist.js'
  export default {
    mixins: [wxMinxin],
    data: function () {  // store data
      return {
        initLnglatXY: [],
        isCheck: false,
        serialeCode: '',
        outTime: 5, // 超时时间, 单位:分
        mapHeight: 0,
        mapKey: '',
        showPopover: false,
        loading: null,
        popoverAddr: null,
        address: {
          city: '',
          district: '',
          formattedAddress: ''
        },
        mapObj: null,
        geocoder: null,
        geolocation: null,
        mapMarker: null,
        longitude: 0,
        latitude: 0
      }
    },
    computed: {
      addressText () {
        let address = ''
        if (this.address.formattedAddress) {
          address = this.address.formattedAddress
        } else if (this.address.city && this.address.district) {
          address = `${this.address.city}${this.address.district}`
        }
        if (this.popoverAddr && this.popoverAddr.length) {
          this.popoverAddr.innerHTML = address
        }
        return address
      },
      isInitMark () {
        return !!(this.isCheck === true && this.initLnglatXY.length && this.mapObj)
      }
    },
    methods: { // methods
      sendPosition () {
        let vm = this
        const navi = vm.mapObj.getCenter()
        vm.loading = this.Toast.loading('正在发送接人指令...')
        vm.$http.post(vm.$service.service.getNavi, {
          lacType: 1, // 接人
          serialeCode: vm.serialeCode,
          lng: navi.getLng(),
          lat: navi.getLat()
        }).then((data) => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
          if (data === null) {
            vm.$Dialog({
              iconClass: 'weui-icon-error',
              message: `<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
              发送位置不成功!
            </span></br>
            <span>${data.resultDesc}</span>`
            })
          } else {
            vm.$Dialog({
              iconClass: 'weui-icon-success-no-circle',
              message: `<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
                          发送位置成功!
                        </span></br>
                        <span>马上就来接您,请耐心等候。</span>`
            })
          }
          vm.mapObj.clearMap()
        }).catch(() => {
          if (vm.loading) {
            vm.loading.close()
            vm.loading = null
          }
        })
      },
      initMap () {
        let vm = this
        vm.mapObj = new AMap.Map('map-container', {
          resizeEnable: true,
          zoom: 13
        })
        vm.mapObj.on('complete', function (data) {
          vm.initMapSearch()
          vm.checkPickUp()
        })
        vm.mapObj.on('moveend', function (data) {
          if (vm.mapMarker) {
            const center = vm.mapObj.getCenter()
            vm.mapMarker.setPosition(center)
            // 根据经纬度查询地址
            vm.getAddressByLnglatXY(center)
          }
        })
        AMap.service('AMap.Geocoder', function () { // 回调函数
          // 实例化Geocoder
          vm.geocoder = new AMap.Geocoder({
            city: '010' // 城市，默认：“全国”
          })
        })
      },
      // 获取当前经纬度
      getLocation () {
        let vm = this
        vm.getWXLocation((lng, lat) => {
          vm.longitude = lng
          vm.latitude = lat
          vm.initLnglatXY = [vm.longitude, vm.latitude]
        })
      },
      getGEO () {
        const vm = this
        vm.mapObj.plugin('AMap.Geolocation', function () {
          vm.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
            // showMarker: false
          })
          vm.mapObj.addControl(vm.geolocation)
          vm.geolocation.getCurrentPosition()
          AMap.event.addListener(vm.geolocation, 'complete', onComplete)// 返回定位信息
          AMap.event.addListener(vm.geolocation, 'error', onError)      // 返回定位出错信息
        })
        // 解析定位结果
        function onComplete (data) {
          vm.longitude = data.position.getLng()
          vm.latitude = data.position.getLat()
          vm.address.city = data.addressComponent.city
          vm.address.district = data.addressComponent.district
          vm.address.formattedAddress = data.formattedAddress
          vm.loading.close()
          vm.initMarker()
          alert(`高德定位: 经度(${vm.longitude}), 纬度(${vm.latitude})`)
        }
        // 解析定位错误信息
        function onError (data) {
          const vm = this
          vm.longitude = 0
          vm.latitude = 0
          alert('定位不成功')
        }
      },
      initMapSearch () {
        let vm = this
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
          let autoOptions = {
            city: '', // 城市，默认全国
            input: 'searchInput'// 使用联想输入的input的id
          }
          let autocomplete = new AMap.Autocomplete(autoOptions)
          let placeSearch = new AMap.PlaceSearch({
            city: '',
            map: vm.mapObj
          })
          AMap.event.addListener(autocomplete, 'select', function (e) {
            placeSearch.setCity(e.poi.adcode)
            let location = e.poi.location
            let lngX = location.getLng()
            let latY = location.getLat()
            const newPostion = new AMap.LngLat(lngX, latY)
            vm.getAddressByLnglatXY(newPostion)
            vm.mapKey = e.poi.name
            vm.mapObj.setCenter(newPostion)
            vm.justPoper()
            vm.mapMarker.setPosition(newPostion)
          })
        })
      },
      // 根据经纬度查询地址
      getAddressByLnglatXY (lnglatXY) {
        let vm = this
        if (vm.geocoder && lnglatXY) {
          vm.geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              vm.address.formattedAddress = result.regeocode.formattedAddress
              vm.justPoper()
            } else {
              vm.address.formattedAddress = '获取地址不成功'
            }
          })
        }
      },
      justPoper () {
        this.$nextTick(function () {
          this.showPopover = true
          const popover = this.$refs.map.querySelector('.popover')
          if (popover) {
            this.popoverAddr = popover.querySelector('.map-address')
            let _h = popover.clientHeight
            if (_h) {
              _h = -(Math.floor(_h) + 3) + 'px'
            }
            popover.style.top = _h
          }
        })
      },
      initMarker () {
        let vm = this
        if (vm.mapObj && vm.longitude && vm.latitude) {
          // const tmp = ``
          vm.mapMarker = new AMap.Marker({
            map: vm.mapObj,
            animation: 'AMAP_ANIMATION_DROP',
            bubble: true,
            offset: new AMap.Pixel(-15, -34),
            position: [vm.longitude, vm.latitude] // 基点位置
            // content: tmp   // 自定义点标记覆盖物
          })
          vm.mapMarker.setContent(vm.$refs.mapMarker)
          const $btnSendPos = document.querySelector('#btn-sendPosition')
          $btnSendPos.addEventListener('touchstart', this.sendPosition)
          setTimeout(this.justPoper, 300)
        }
      },
      checkPickUp () {
        const vm = this
        vm.serialeCode = vm.$route.query.serialeCode
        if (!vm.serialeCode) {
          vm.Toast.error('url中缺失serialeCode', 0)
          return
        }
        vm.$http.post(vm.$service.service.checkPickUp, {
          serialeCode: vm.serialeCode
        }).then((data) => {
          if (!data) {
            vm.Toast.error('任务不存在', 0)
            return
          }
          const status = parseInt(data.data.status)
          let flag = true
          if (status === 2) { // 超时
            flag = false
            vm.Toast.warn(`<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
                          接人指令已超时
                        </span></br>
                        <span>请在公众号中重新发送指令</span>`, 0)
          } else if (status === 1) {
            flag = false
            vm.Toast.warn(`<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
                          当前接人任务已完成
                        </span></br>
                        <span>请在公众号中重新发送指令</span>`, 0)
          } else if (status === 3) {
            flag = false
            vm.Toast.warn(`<span class="font_2D" style="line-height: 3.13rem;margin-left: 1rem;margin-right: 1rem;">
                          设备不在线
                        </span></br>
                        <span>无法使用接人功能</span>`, 0)
          }
          if (flag === false) {
            if (vm.mapObj) {
              vm.mapObj.clearMap()
            }
          } else {
            vm.isCheck = true
          }
        })
      },
      share () {
        const vm = this
        const serialeCode = vm.$route.query.serialeCode
        const nickName = vm.$route.query.nickName ? decodeURIComponent(vm.$route.query.nickName) : ''
        vm.pickFriend(nickName, serialeCode)
      }
    },
    watch: {
      isInitMark (flag) {
        const vm = this
        if (flag === true) {
          vm.mapObj.setZoomAndCenter(15, this.initLnglatXY)
          vm.getAddressByLnglatXY(this.initLnglatXY)
          vm.initMarker()
        }
      }
    },
    mounted () {
      // this.loading = this.Toast.loading('正在定位...')
      this.mapHeight = `${window.innerHeight - this.$refs.searchBar.clientHeight}px`
      this.initMap()
    },
    beforeCreate () {
      const vm = this
      vm.$on('handleWXReady', () => {
        vm.share()
        vm.getLocation()
      })
    }
  }
</script>
