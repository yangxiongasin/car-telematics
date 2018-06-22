<template>
    <div class="pathMap ">
      <div id="pathMap">
        <div class="pathMap_loading flex_center">地图正在加载...</div>
      </div>
      <div class="wp_head flex_cen_bet font_7B_75 mr_top_125" v-if="InternalJump">
        {{getDate(mess.createTime)}}
      </div>

      <div class="y_wp_content" v-if="InternalJump">
        <div class="weui-flex">
          <div class="over_hidden">
            <div class="wp_con_start">
              <span class=" flex_center font_FFF_63" >起</span>
            </div>
            <div class="line-7d"></div>
          </div>
          <span class="font_2D_1 ">{{mess.startLac}}</span>
        </div>
        <div class="line">
          <div class="line-7d"></div>
        </div>
        <div class="weui-flex">
          <div>
            <div class="wp_con_start">
              <span class=" flex_center font_FFF_63" >终</span>
            </div>
          </div>
          <span class="font_2D_1 ">{{mess.endLac}}</span>
        </div>
      </div>
    </div>
</template>

<script>
  import vueMap from 'AMap'
  import wxMinxin from '../../mixin/wx-api'
  import {getChangeDate} from '@/utils/assist.js'

  const uuid = require('uuid/v4')
  let pathMap
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        plugins: ['Amap.Geocoder'],
        InternalJump: true,
        mess: {
          createTime: '1'
        },
        polyline: '',
        marker: ''
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.getUserInfo
      }
    },
    methods: {
      getDate (time) {
        return getChangeDate(time)
      },
      init: function (routerID, startLng, startLat, endLng, endLat) {
        let vm = this
        vm.$http.post(vm.$service.monitor.routeDetail, {
          routeId: routerID
        }).then(data => {
          console.log(routerID, startLng, startLat, endLng, endLat, 'yyy')
          let addrMap = []
          for (let i = 0; i < data.data.length; i++) {
            let arr = []
            arr[0] = data.data[i].lng
            arr[1] = data.data[i].lat
            addrMap.push(arr)
          }
          // 初始化地图
          pathMap = new vueMap.Map('pathMap', {
            resizeEnable: true,
            center: [startLng, startLat],
            zoom: 13
          })
          // 添加控制组件
          pathMap.plugin(['AMap.ToolBar'], function () {
            pathMap.addControl(new vueMap.ToolBar())
          })
          // 开始点标志
          vm.startmarker = new vueMap.Marker({
            content: '<icon class="weui-icon-ai-map-marker" style="color:red;font-size: 1.5rem"></icon>',
            offset: new vueMap.Pixel(-17, -42), // 相对于基点的偏移位置
            position: [startLng, startLat]
          })
          // 结束点标志
          vm.endmarker = new vueMap.Marker({
            content: `<icon class="weui-icon-ai-map-marker" style="color:blue;font-size: 1.5rem"></icon>`,
            position: [endLng, endLat]
          })
          // 路程线路
          // 添加覆盖物线的样式
          vm.polyline = new vueMap.Polyline({
            path: addrMap,            // 设置线覆盖物路径
            strokeColor: '#408fff',   // 线颜色
            strokeOpacity: 1,         // 线透明度
            strokeWeight: 5,          // 线宽
            strokeStyle: 'solid',     // 线样式
            strokeDasharray: [10, 5], // 补充线样式
            geodesic: true            // 绘制大地线
          })
          vm.polyline.setMap(pathMap)
          vm.startmarker.setMap(pathMap)
          vm.endmarker.setMap(pathMap)
        })
      },
      getUuid () {
        return uuid().replace(/-/g, '')
      }
    },
    mounted () {
      let vm = this
      if (vm.$route.params.item && vm.$route.params.item.serialCode) {
        console.log(1)
        vm.mess = vm.$route.params.item
        let routerID = vm.mess.serialCode
        let startLng = vm.mess.startLng
        let startLat = vm.mess.startLat
        let endLng = vm.mess.endLng
        let endLat = vm.mess.endLat
        vm.init(routerID, startLng, startLat, endLng, endLat)
        vm.sharePathMap(routerID, startLng, startLat, endLng, endLat, vm.userInfo.nickName, vm.getUuid())
      } else {
        vm.InternalJump = false
        const href = location.href
        const idIdx = href.indexOf('&id=') + 4
        const slatIdx = href.indexOf('&slat=')
        const slngIdx = href.indexOf('&slng=')
        const elatIdx = href.indexOf('&elat=')
        const elngIdx = href.indexOf('&elng=')
        let routerID = href.slice(idIdx, slatIdx)
        let startLng = href.slice(slngIdx + 6, elatIdx)
        let startLat = href.slice(slatIdx + 6, slngIdx)
        let endLng = href.slice(elngIdx + 6, -1)
        let endLat = href.slice(elatIdx + 6, elngIdx)
        vm.init(routerID, startLng, startLat, endLng, endLat)
      }
    }
  }
</script>
