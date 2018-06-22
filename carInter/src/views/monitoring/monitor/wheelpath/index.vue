<template>
    <div class="wheelpath">
      <m-scroll-new @on-refresh="onRefresh" @on-infinite="onInfinite" :loading-text="loadingText">
          <div v-for="(item, index) in wpData" v-if="wheelpathShow">
            <div class="wp_head flex_cen_bet font_7B_75">
              <span>{{getDate(item.createTime)}}</span>
            </div>
            <m-cell-swipe @on-delete="handleDelete(item)">
              <div class="y_wp_content" >
                <div class="weui-flex trace-start">
                  <div class="trace-icon">
                    <div class="wp_con_start">
                      <span class=" flex_center font_FFF_63" >起</span>
                    </div>
                    <div class="line-7d"></div>
                  </div>
                  <a class="font_2D_1 color_758ef7"  @click.stop.prevent="pathMap(item)">{{item.startLac}}</a>
                </div>
                <div class="weui-flex trace-end">
                  <div class="trace-icon">
                    <div class="wp_con_start">
                      <span class=" flex_center font_FFF_63" >终</span>
                    </div>
                  </div>
                  <a class="font_2D_1 color_758ef7"  @click.stop.prevent="pathMap(item)">{{item.endLac}}</a>
                </div>
              </div>


            </m-cell-swipe>
          </div>
          <div class="realMedia no-photos" v-if="!wheelpathShow">
            <div class="realPhotoTitle flex_center_col">
              <div class="font_7B_1" style="text-align: center" >
                <i class="weui-icon-ai-planet" style="font-size: 5rem"></i>
                <p class="pd_top_88">暂无行车轨迹数据</p>
              </div>
            </div>
          </div>
      </m-scroll-new>

      <m-action-sheet  v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_del">

      </m-action-sheet>
    </div>
</template>

<script>
  import AMap from 'AMap'
  import {getChangeDate} from '@/utils/assist.js'

  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        loadingText: '',
        wpDataTotalCount: 0,
        wpData: [],
        model_sure_del: false,
        menus: ['<div style="color:#ff5f5f">确定删除</div>'],
        BindEquList: '',
        currentPage: 1,
        pageSize: 5,
        delSerialCodes: '',
        wheelpathShow: true,
        startAddrAll: [],
        endAddrAll: []
      }
    },
    methods: {
      handleDelete (item, index) {
        this.model_sure_del = true
        this.delSerialCodes = item.serialCode
      },
      getDate (time) {
        return getChangeDate(time)
      },
      sure_del (val) {
        let vm = this
        vm.$http.post(vm.$service.monitor.getDelRoute, {
          imei: vm.BindEquList.imei,
          serialCodes: vm.delSerialCodes
        }).then(data => {
          if (data !== null) {
            vm.$Toast({
              message: '删除成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
          }
        })
        this.getWheelPath()
        vm.model_sure_del = false
      },
      getWheelPath (done) {
        let vm = this
        vm.loadingText = ''
        vm.$http.post(vm.$service.monitor.getRoute, {
          imei: vm.BindEquList.imei,
          currentPage: vm.currentPage,
          pageSize: vm.pageSize
        }).then(data => {
          if (done && typeof done === 'function') {
            done()
          }
          if (data && data.data && data.data.routeList) {
            vm.wpData = data.data.routeList
            let totalCount = data.data.pagerInfo.totalCount
            vm.wpDataTotalCount = data.data.pagerInfo.totalCount
            if (totalCount === 0) {
              vm.wheelpathShow = false
            } else {
              vm.wheelpathShow = true
              vm.startAddrAll = []
              vm.endAddrAll = []
              for (let i = 0; i < vm.wpData.length; i++) {
                vm.startAddrAll.push([vm.wpData[i].startLng, vm.wpData[i].startLat])
                vm.endAddrAll.push([vm.wpData[i].endLng, vm.wpData[i].endLat])
              }
            }
          } else {
            vm.wheelpathShow = false
          }
        }).catch((e) => {
          if (done && typeof done === 'function') {
            done()
          }
        })
      },
      pathMap (item) {
        this.$router.push({name: 'pathMap', params: {item: item}})
      },
      // 下拉刷新
      onRefresh (done) {
        this.currentPage = 1
        this.getWheelPath(done)
      },
      // 上滑增加数据 目前为模拟数据，所以数据值值只能为一次性全部获取
      onInfinite (done) {
        let vm = this
        if (vm.wpDataTotalCount <= vm.pageSize) { // 总数量小于1页的数量就不加载了
          return
        }
        if (vm.wpData.length === vm.wpDataTotalCount) { // 总数达到记录数不加载
          return
        }
        vm.loadingText = '数据加载中...'
        if (this.$el.querySelector('.load-more').innerHTML !== '已全部加载') {
          vm.$http.post(vm.$service.monitor.getRoute, {
            imei: vm.BindEquList.imei,
            currentPage: vm.currentPage + 1,
            pageSize: vm.pageSize
          }).then(data => {
            vm.loadingText = ''
            if (data && data.data && data.data.routeList) {
              vm.currentPage++
              for (let i = 0; i < data.data.routeList.length; i++) {
                vm.wpData.push(data.data.routeList[i])
                vm.startAddrAll.push([data.data.routeList[i].startLng, data.data.routeList[i].startLat])
                vm.endAddrAll.push([data.data.routeList[i].endLng, data.data.routeList[i].endLat])
              }
              let totalCount = data.data.pagerInfo.totalCount
              vm.wpDataTotalCount = data.data.pagerInfo.totalCount
              if (vm.wpData.length === totalCount) {
                vm.loadingText = '已全部加载'
              }
            } else {
              vm.loadingText = '加载数据不成功,请稍后重试'
            }
          }).catch((e) => {
            vm.loadingText = '加载数据不成功,请稍后重试'
          })
        }
      },
      getAddr (val, len, sta) {
        let vm = this
        for (let i = 0; i < len; i++) {
          AMap.service('AMap.Geocoder', function () { // 回调函数
            // 实例化Geocoder
            vm.geocoder = new AMap.Geocoder({
              city: '010'// 城市，默认：“全国”
            })
            vm.geocoder.getAddress(val[i], (status, result) => {
              if (status === 'complete' && result.info === 'OK') {
                // 获得了有效的地址信息:
                if (sta > 0) {
                  vm.wpData[i].startLac = result.regeocode.formattedAddress
                } else {
                  vm.wpData[i].endLac = result.regeocode.formattedAddress
                }
              } else {
                // 获取地址不成功
                vm.Toast.error('获取地址不成功')
              }
            })
          })
        }
      }
    },
    watch: {
      startAddrAll (val) {
        let len = val.length
        if (len === this.wpData.length) {
          this.getAddr(val, len, 1)
        }
      },
      endAddrAll (val) {
        let len = val.length
        if (len === this.wpData.length) {
          this.getAddr(val, len, 0)
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.BindEquList = this.$store.getters.getDefaultDevice
      this.getWheelPath()
    }
  }
</script>
