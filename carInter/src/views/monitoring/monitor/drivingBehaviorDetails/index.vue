<template>
    <div class="drivingBehaviorDetails">
      <div class="drivingBehaviorDetails_head flex_cen_bet border_bm_18">
        <div v-for='item in date_data'
             :class="{curSelect:iscur===item.index}" class="tab_drivingBehaviorDetails weui-flex font_7B_175" @click="switchTab(item)" :key="item.index">
          <span>{{item.name}}</span>
        </div>
      </div>

      <m-scroll-new @on-refresh="onRefresh" @on-infinite="onInfinite" :loading-text="loadingText">
        <div class="realMedia no-photos" v-if="hasDrivingBehaviorDetails">
          <div class="realPhotoTitle flex_center_col" >
            <div class="font_7B_1" style="text-align: center" >
              <i class="weui-icon-ai-share-variant" style="font-size: 5rem"></i>
              <p class="pd_top_88">{{date_data[iscur].name === '全部' ? '' : date_data[iscur].name}}暂无驾驶情况</p>
            </div>
          </div>
        </div>
        <div class="drivingBehaviorDetails_contain" v-if="!hasDrivingBehaviorDetails" v-for="(item, index) in drivingBehavior_data" :key="'data' + index">
          <div class="wp_head flex_cen_bet font_7B_75">
            <span>行程：{{getDate(item.createTime)}}</span>
            <span>{{item.distance}}</span>
          </div>
          <div class="flex_cen_bet border_bm_18">
            <div class="y_wp_content" >
              <div class="weui-flex trace-start">
                <div class="trace-icon">
                  <div class="wp_con_start">
                    <span class=" flex_center font_FFF_63" >起</span>
                  </div>
                  <div class="line-7d"></div>
                </div>
                <a class="font_2D_1">{{item.startLac}}</a>
              </div>
              <div class="weui-flex trace-end">
                <div class="trace-icon">
                  <div class="wp_con_start">
                    <span class=" flex_center font_FFF_63" >终</span>
                  </div>
                </div>
                <a class="font_2D_1"  >{{item.endLac}}</a>
              </div>
            </div>
            <div class="color_918_639 scores">
              <span style="font-size: 1.5rem">{{item.score}}</span>
              <span class="font_2D_88">分</span>
            </div>
          </div>
          <div class="infractions font_7B_75 flex_wrap_bet">
            <span>急加速：<i>{{item.speedUp}}</i>次</span>
            <span>急减速：<i>{{item.speedDown}}</i>次</span>
            <span v-show="item.professionaFalg">碰撞：<i>{{item.collision}}</i>次</span>
            <span v-show="item.professionaFalg">急左转：<i>{{item.leftTurn}}</i>次</span>
            <span v-show="item.professionaFalg">急右转：<i>{{item.rightTurn}}</i>次</span>
            <span>急刹车：<i>{{item.brake}}</i>次</span>
          </div>
        </div>
      </m-scroll-new>
    </div>
</template>

<script>
  import AMap from 'AMap'
  import {getToday, getChangeDate} from '../../../../utils/assist.js'
  import wxMinxin from '../../mixin/wx-api'
  let today = getToday()
  let yesterday = getToday(new Date() - 24 * 3600 * 1000)
  let weekday = getToday(new Date() - 24 * 3600 * 6 * 1000)
  let startDay = '2017-12-01'

  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        loadingText: '',
        iscur: 0, // 当前页数
        date_data: [
          {name: '今天', index: 0},
          {name: '昨天', index: 1},
          {name: '近七天', index: 2},
          {name: '全部', index: 3}
        ],
        hasDrivingBehaviorDetails: false,
        beginTime: today, // 开始时间
        endTime: today, // 结束时间
        currentPage: 1, // 当前页数
        drivingBehavior_data: [], // 驾驶行为数据
        drivingBehavior_data_TotalCount: 0, // 驾驶行为数据
        startAddrAll: [],
        endAddrAll: []
      }
    },
    watch: {
      iscur (val) {
        let vm = this
        switch (val) {
          case 0 : vm.beginTime = today; vm.endTime = today
            vm.updateDrivingBehaviorDetail(); break
          case 1 : vm.beginTime = yesterday; vm.endTime = yesterday
            vm.updateDrivingBehaviorDetail(); break
          case 2 : vm.beginTime = weekday; vm.endTime = today
            vm.updateDrivingBehaviorDetail(); break
          case 3 : vm.beginTime = startDay; vm.endTime = today
            vm.updateDrivingBehaviorDetail(); break
        }
      },
      // 当startAddrAll的length === 驾驶行为数据的length的时候
      startAddrAll (val) {
        let len = val.length
        if (len === this.drivingBehavior_data.length) {
          this.getAddr(val, len, 1)
        }
      },
      endAddrAll (val) {
        let len = val.length
        if (len === this.drivingBehavior_data.length) {
          this.getAddr(val, len, 0)
        }
      }
    },
    methods: {
      // 切换tab
      switchTab (item) {
        let vm = this
        if (vm.iscur !== item.index) {
          vm.iscur = item.index
          this.currentPage = 1
        }
      },
      getDate (time) {
        return getChangeDate(time)
      },
      onRefresh (done) {
        this.currentPage = 1
        this.updateDrivingBehaviorDetail(done)
      },
      // 上滑增加数据 目前为模拟数据，所以数据值值只能为一次性全部获取
      onInfinite (done) {
        let vm = this
        if (vm.drivingBehavior_data_TotalCount <= 1) { // 总数量小于1页的数量就不加载了
          return
        }
        if (vm.drivingBehavior_data.length === vm.drivingBehavior_data_TotalCount) { // 总数达到记录数不加载
          return
        }
        vm.loadingText = '数据加载中...'
        if (this.$el.querySelector('.load-more').innerHTML !== '已全部加载') {
          vm.$http.post(vm.$service.monitor.getRoute, {
            imei: vm.BindEquList.imei,
            currentPage: vm.currentPage + 1,
            pageSize: 3
          }).then(data => {
            vm.loadingText = ''
            if (data && data.data && data.data.routeList) {
              vm.currentPage++
              for (let i = 0; i < data.data.routeList.length; i++) {
                vm.drivingBehavior_data.push(data.data.routeList[i])
                vm.startAddrAll.push([data.data.routeList[i].startLng, data.data.routeList[i].startLat])
                vm.endAddrAll.push([data.data.routeList[i].endLng, data.data.routeList[i].endLat])
              }
              let totalCount = data.data.pagerInfo.totalCount
              vm.drivingBehavior_data_TotalCount = data.data.pagerInfo.totalCount
              if (vm.drivingBehavior_data.length === totalCount) {
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
      // 获取本次驾驶得分情况
      updateDrivingBehaviorDetail (done) {
        let vm = this
        vm.loadingText = ''
        vm.drivingBehavior_data = []
        // 获取默认设备，如果无默认设备或者默认设备imei不存在，则退出函数
        vm.BindEquList = this.$store.getters.getDefaultDevice
        if (!vm.BindEquList || !vm.BindEquList.imei) {
          return
        }
        vm.$http.post(vm.$service.monitor.getRoute, {
          imei: vm.BindEquList.imei,
          beginTime: this.beginTime,
          endTime: this.endTime,
          currentPage: 1,
          pageSize: 3
        }).then(data => {
          if (done && typeof done === 'function') {
            done()
          }
          if (data && data.data && data.data.routeList) {
            vm.drivingBehavior_data = data.data.routeList
            let totalCount = data.data.pagerInfo.totalCount
            vm.drivingBehavior_data_TotalCount = data.data.pagerInfo.totalCount
            if (totalCount === 0) {
              vm.hasDrivingBehaviorDetails = true
            } else {
              vm.hasDrivingBehaviorDetails = false
              vm.startAddrAll = []
              vm.endAddrAll = []
              for (let i = 0; i < vm.drivingBehavior_data.length; i++) {
                vm.startAddrAll.push([vm.drivingBehavior_data[i].startLng, vm.drivingBehavior_data[i].startLat])
                vm.endAddrAll.push([vm.drivingBehavior_data[i].endLng, vm.drivingBehavior_data[i].endLat])
              }
            }
          } else {
            vm.hasDrivingBehaviorDetails = true
          }
        })
      },
      // 获取地址
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
                  vm.drivingBehavior_data[i].startLac = result.regeocode.formattedAddress
                } else {
                  vm.drivingBehavior_data[i].endLac = result.regeocode.formattedAddress
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
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.updateDrivingBehaviorDetail()
    }
  }
</script>
