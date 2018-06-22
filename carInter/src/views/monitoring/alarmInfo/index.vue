<template>
  <div class="mediaDetails">
    <div class="im_top img_100">
      <img v-if="isImage" :src="imageMess.url" alt="">
      <video v-if="!isImage" :src="imageMess.url"
             controls="controls">您的浏览器不支持 video 标签</video>
    </div>
    <div class="im_message" >
      <div class="im_time_icon flex_wrap_bet">
        <div class="im_time font_7B_75">{{imageMess.time?imageMess.time:'null'}}</div>
      </div>
      <div class="im_address mr_top_5 weui-flex" :title="addr">
          <span class="im_dingwei ">
            <i class="weui-icon-ai-map-marker"></i>
          </span>
        <span class="im_addr font_2D_1">
            {{addr}}
            <span @click="toggleMap" class="im_icon_up_down">
              <i :class="[up_down_icon ? 'weui-icon-ai-chevron-down' : 'weui-icon-ai-chevron-up']"></i>
            </span>
          </span>
      </div>
    </div>

    <div id="map-container" class="im_map flex_center" v-show="mapShow">
      <span>地图正在加载...</span>
    </div>

  </div>
</template>

<script>
  import mapMixin from '../mixin/map-position'
  import {getChangeDate} from '@/utils/assist.js'
  import wxMinxin from '../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin, mapMixin],
    data () {
      return {
        imageMess: '',
        uid: '',
        up_down_icon: true,
        mapShow: true, // 定位地图是否显示
        isImage: true // 判断显示视频还是图片
      }
    },
    methods: {
      init () {
        let vm = this
        vm.uid = this.$route.query.uid || ''
        if (!vm.uid) {
          this.Toast.error('没有传入uid')
          return
        }
        vm.$http.post(vm.$service.newsDetail, {
          uid: vm.uid
        }).then(data => {
          if (data) {
            vm.imageMess = data.data
            if (vm.imageMess.time && vm.imageMess.time.time) {
              vm.imageMess.time = vm.getDate(vm.imageMess.time.time)
            }
            if (vm.imageMess.lat && vm.imageMess.lng) {
              vm.initMap('map-container', vm.imageMess.online, vm.imageMess.lng, vm.imageMess.lat)
            }
            if (vm.imageMess.type === 'VIDEO') {
              vm.isImage = false
            } else {
              vm.isImage = true
            }
          }
        })
      },
      // 点击上下箭头，判断是否切换图片
      toggleMap () {
        let vm = this
        vm.up_down_icon = !vm.up_down_icon
        vm.mapShow = !vm.mapShow
      },
      getDate (time) {
        return getChangeDate(time)
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      let vm = this
      vm.init()
    }
  }
</script>
