/**
 * Created by summer on 2017/11/13.
 */
import AMap from 'AMap'
import {addClass} from '@/utils/assist.js'
export default {
  data: function () {
    return {
      mapObj: null,
      mapMarker: null,
      addr: ''
    }
  },
  methods: {
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
      const index = location.href.indexOf('/views/')
      const host = location.href.substring(0, index)
      let imgOnlineLink = `${host}/static/img/icon_online.png`
      // let animate = 'AMAP_ANIMATION_BOUNCE' // 动画类型
      let animate = 'AMAP_ANIMATION_NONE' // 动画类型
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
        animation: animate, // 取消弹跳动画
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
