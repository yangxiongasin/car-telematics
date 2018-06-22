<template>
  <div class="monitor">
    <!--轮播图-->
    <m-swipe :content="advertising" contentKey="imageUrl">
    </m-swipe>
    <!--实时照片、实时视频、实时定位、行车轨迹-->
    <div class="monitorFunc flex_wrap_bet" >
      <template  v-for="item in real_list">
        <!--<a class="flex_center_col" v-if="wkwebview === true && item.name === '实时定位' && hasDevice" :href="getPickUrl()">-->
          <!--<div class="monitorFunc_icon flex_center" :class="item.bgClass">-->
            <!--<i :class="item.iconClass"></i>-->
          <!--</div>-->
          <!--<div class="monitorFunc_name font_7B_88">-->
            <!--<span>{{item.name}}</span>-->
          <!--</div>-->
        <!--</a>-->
        <router-link class="flex_center_col"  :to="{name: item.path}">
          <div class="monitorFunc_icon flex_center" :class="item.bgClass">
            <i :class="item.iconClass"></i>
          </div>
          <div class="monitorFunc_name font_7B_88">
            {{item.name}}
          </div>
        </router-link>
      </template>
    </div>
    <!--驾驶行为及行为得分-->
    <div class="drivingBehavior mr_bm_125" v-if="hasDevice && noshow" >
      <div class="flex_cen_bet mr_bm_5">
        <span class="font_7B_15 color_fff">本次驾驶得分</span>
        <i class="weui-icon-ai-chevron-right" v-show="hasDrivingBehaviorData" @click="jump('drivingBehaviorDetails')"></i>
      </div>
      <div class="flex_cen_bet details" v-show="hasDrivingBehaviorData && noshow">
        <ul>
          <li>急加速<span>{{drivingBehavior.speedUp}}</span>次</li>
          <li>急刹车<span>{{drivingBehavior.brake}}</span>次</li>
          <li>急减速<span>{{drivingBehavior.speedDown}}</span>次</li>
          <li v-show="drivingBehavior.professionaFalg">急左转<span>{{drivingBehavior.leftTurn}}</span>次</li>
          <li v-show="drivingBehavior.professionaFalg">碰撞<span>{{drivingBehavior.collision}}</span>次</li>
          <li v-show="drivingBehavior.professionaFalg">急右转<span>{{drivingBehavior.rightTurn}}</span>次</li>
        </ul>
        <div class="circularDiagram">
          <m-circular-progress  :progress="drivingBehavior.score" :size="progressSize" ref="circlu"></m-circular-progress>
          <div class="scores flex_center">
            <span style="font-size: 1.5rem">{{drivingBehavior.score}}</span>
            <span class="font_2D_88 color_fff">分</span>
          </div>
        </div>
      </div>

      <div class="text_cen no_drivingBehavior"  v-show="!hasDrivingBehaviorData && noshow">
        <span class="font_2D_88 color_fff">暂无驾驶数据，赶快出发吧！</span>
      </div>
    </div>
    <!--违章查询-->
    <!--<div class="latelyPhoto">-->
      <!--<div class="latelyPhoto_title flex_cen_bet">-->
        <!--<span>抓拍视频</span>-->
        <!--<router-link class="latelyPhoto_title_icon flex_center" :to="{name: 'IllegallyGallery'}">-->
          <!--<i class="weui-icon-ai-chevron-right"></i>-->
        <!--</router-link>-->
      <!--</div>-->
      <!--<div class=" flex_sta_bet">-->
        <!--<div v-for="(item, index) in Illegally" :key="index" >-->
          <!--<div class="latelyPhoto_cont_img" @click="jumpDetail(item)">-->
            <!--<img v-lazy="item.snapshoot" alt="">-->
            <!--<div class="videoModel flex_center">-->
              <!--<i class="weui-icon-ai-play-circle-outline"></i>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--最近照片/最近视频-->
    <div class="latelyPhoto" v-for="items in latelyMedia">
      <div class="latelyPhoto_title flex_cen_bet">
        <span>{{items.name}}</span>
        <router-link class="latelyPhoto_title_icon flex_center" :to="{name: items.src}">
          <i class="weui-icon-ai-chevron-right"></i>
        </router-link>
      </div>
      <div class=" flex_sta_bet">
        <div v-for="(item, index) in items.data" :key="items.src + index" >
          <m-media-detail :media="item"></m-media-detail>
        </div>
      </div>
      <div class="no-media flex_center_col" v-show="items.data.length === 0" @click="jump('realPhoto')">
        <i :class="items.no_media_icon"></i>
        <span class="font_7B_75">{{items.no_media}}</span>
      </div>
    </div>

  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import wxMinxin from '../mixin/wx-api'
  const uuid = require('uuid/v4')
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
//        wkwebview: window.__wxjs_is_wkwebview,
//        wkwebview: true,
        // 这是照片库／视频库/实时定位/行车轨迹等信息
        real_list: [
          {
            name: '实时照片',
            bgClass: 'bg_photo',
            path: 'realPhoto',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-camera'
          },
          {
            name: '实时视频',
            bgClass: 'bg_vedio',
            path: 'realVideo',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-video'
          },
          {
            name: '实时定位',
            bgClass: 'bg_loca',
            path: 'realLocation',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-near-me'
          },
          {
            name: '行车轨迹',
            bgClass: 'bg_car',
            path: 'wheelpath',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-planet'
          }
        ],
        latelyMedia: [
          {
            data: [],
            name: '最近照片',
            src: 'photoGallery',
            no_media_icon: 'weui-icon-ai-no-photo',
            no_media: '快来拍照片吧~'
          },
          {
            data: [],
            name: '最近视频',
            src: 'videoGallery',
            no_media_icon: 'weui-icon-ai-no-video',
            no_media: '还没有视频哟～'
          }
        ],
        //        Illegally: [],
        drivingBehavior: {},
        noshow: false, // 不让显示
        hasDrivingBehaviorData: true,
        progressSize: 5.19, // 环形图的大小
        BindEquList: ''
      }
    },
    computed: {
      hasDevice () {
        return !!(this.$store.state.bindEquList && this.$store.state.bindEquList.imei)
      },
      advertising () {
        return this.$store.state.equModelsAds
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    methods: { // methods
      // 没什么卵用要删掉的
      //      jumpDetail (value) {
      //        let Illegally = JSON.parse(sessionStorage.getItem('currentIllegallyStatus'))
      //        let data = {
      //          id: value.createTime,
      //          status: true
      //        }
      //        if (Illegally === undefined || Illegally.length === 0) {
      //          Illegally.push(data)
      //        } else {
      //          let arr = []
      //          for (let i = 0; i < Illegally.length; i++) {
      //            arr.push(Illegally[i].id)
      //          }
      //          if (arr.indexOf(data.id) === -1) {
      //            Illegally.push(data)
      //          }
      //        }
      //        sessionStorage.setItem('currentIllegallyDetail', JSON.stringify(value))
      //        sessionStorage.setItem('currentIllegallyStatus', JSON.stringify(Illegally))
      //        this.$router.push({name: 'IllegallyDetail'})
      //      },
      // 图片视频查询接口
      //      getIllegallyMedia () {
      //        let vm = this
      //        vm.BindEquList = this.$store.getters.getDefaultDevice
      //        if (!vm.BindEquList || !vm.BindEquList.imei) {
      //          return
      //        }
      //        // 通过item值调用getMedia，并将返回的接口数据放置到latelyPtoto/latelyVedio
      //        vm.$http.post(this.$service.monitor.getMedia, {
      //          imei: vm.BindEquList.imei,
      //          type: 6,
      //          currentPage: 1, // （0.图片；1：视频）
      //          pageSize: 3 // （0.图片；1：视频）
      //        }).then(data => {
      //          vm.Illegally = data.data.mediaList
      //          console.log(data.data.mediaList)
      //        }).catch(error => {
      //          console.log(error)
      //        })
      //      },

      jump (value) {
        this.$router.push({name: value})
      },
      // 图片视频查询接口
      getMedia (item) {
        let vm = this
        // 获取默认设备，如果无默认设备或者默认设备imei不存在，则退出函数
        vm.BindEquList = this.$store.getters.getDefaultDevice
        if (!vm.BindEquList || !vm.BindEquList.imei) {
          return
        }
        // 通过item值调用getMedia，并将返回的接口数据放置到latelyPtoto/latelyVedio
        vm.$http.post(this.$service.monitor.getMedia, {
          imei: vm.BindEquList.imei,
          mideaType: item, // （0.图片；1：视频）
          currentPage: 1, // 当前页数
          pageSize: 3 // 当前页面数量
        }).then(data => {
          if (item === 0) {
            vm.latelyMedia[0].data = data.data.mediaList
          } else {
            vm.latelyMedia[1].data = data.data.mediaList
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取本次驾驶得分情况
      getRoute () {
        let vm = this
        // 获取默认设备，如果无默认设备或者默认设备imei不存在，则退出函数
        vm.BindEquList = this.$store.getters.getDefaultDevice
        if (!vm.BindEquList || !vm.BindEquList.imei) {
          return
        }
        vm.$http.post(vm.$service.monitor.getRoute, {
          imei: vm.BindEquList.imei,
          currentPage: 1,
          pageSize: 1
        }).then(data => {
          if (data && data.data && data.data.routeList[0]) {
            vm.hasDrivingBehaviorData = true
            vm.drivingBehavior = data.data.routeList[0]
          } else {
            vm.hasDrivingBehaviorData = false
          }
        })
      },
      getUUID () {
        return uuid().replace(/-/g, '')
      },
      getPickUrl () {
        const index = location.href.indexOf('/views/')
        const host = location.href.substring(0, index)
        const serialCode = this.getUUID()
        return `${host}/share.html?serialeCode=${serialCode}&type=realLocation`
      }
    },
    mounted () {
      // 这里判断进入这个页面的方式是否为第一次进入公众号，如果是则不允许后退
      // 如果退回的地址为undefined，那么重新回到当前页面
      history.pushState(null, null, location.href)
      window.addEventListener('popstate', (event) => {
        if (this.$route.name === undefined) {
          wx.closeWindow()
        }
      }, false)
      // 查询违章拍摄数据
      //      this.getIllegallyMedia()
      // 查询图片数据
      this.getMedia(0)
      // 查询视频数据
      this.getMedia(1)
      // 查询驾驶行为数据
      // this.getRoute()
    },
    created () {
      // 查询轮播图接口
      if (!this.advertising || !this.advertising.length) {
        this.$store.dispatch('getSwipeData')
      }
    }
  }
</script>
