<template>
  <div class="mediaDetails">
    <div class="im_top">
      <div class="flex_center video_top" v-show="playShow">
        <img v-lazy="snapshoot" alt="">
        <i class="weui-icon-ai-play-circle-outline" @click="playVideo"></i>
      </div>
      <video ref="playVideo" :src="vedioMess.path" v-show="!playShow" id="m-vidwo-player" x-webkit-airplay="true" webkit-playsinline="true" x5-video-player-type="h5"
             controls="controls">您的浏览器不支持 video 标签</video>
    </div>
    <div class="im_message" v-if="hasStorge">
      <div class="im_time_icon flex_wrap_bet">
        <div class="im_time font_7B_75">{{vedioMess.produceTime?vedioMess.produceTime:'null'}}</div>
        <div class="im_icon" @click="subDel">
          <i class="weui-icon-delete "></i>
        </div>
      </div>
      <div class="im_address mr_top_5 weui-flex">
          <span class="im_dingwei">
            <i class="weui-icon-ai-map-marker"></i>
          </span>
        <span class="im_addr font_2D_1">
            {{addr}}
            <span @click="toggleMap" class="im_icon_up_down" v-if="false">
              <i :class="[up_down_icon ? 'weui-icon-ai-chevron-down' : 'weui-icon-ai-chevron-up']"></i>
            </span>
          </span>
      </div>
    </div>

    <div class="im_map flex_center img_100" id="vedio-map-container" v-show="mapShow && hasStorge">
      <span>地图</span>
    </div>

    <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_del">

    </m-action-sheet>
  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  import mapMixin from '../../mixin/map-position'
  import {getChangeDate} from '@/utils/assist.js'

  const uuid = require('uuid/v4')

  export default {
    name: '',
    mixins: [mapMixin, wxMinxin],
    data () {
      return {
        playShow: true,
        snapshoot: '',
        up_down_icon: true,
        hasStorge: true,
//        mapShow: false,
        mapShow: true,
        userInfo: {},
        menus: ['<div style="color:#ff5f5f;">确定删除</div>'], // actionSheet的子目录
        model_sure_del: false, // 底部删除图标显示状态
        vedioMess: {}
      }
    },
    methods: {
      playVideo () {
        this.playShow = false
        this.$refs.playVideo.play()
        console.log(this.vedioMess.snapshoot)
      },
      toggleMap () {
        let vm = this
        vm.up_down_icon = !vm.up_down_icon
        vm.mapShow = !vm.mapShow
      },
      init () {
        let vm = this
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.vedioMess.imei
        }).then((data) => {
          if (data) {
            let isOnline = data.data.online
            vm.initMap('vedio-map-container', isOnline, vm.vedioMess.lng, vm.vedioMess.lat)
          }
        })
      },

      // 确定删除
      sure_del (item, index) {
        let vm = this
        let BindEquList = this.$store.getters.getDefaultDevice
        vm.model_sure_del = false
        vm.$http.post(this.$service.monitor.delMedia, {
          imei: BindEquList.imei,
          serialCode: vm.vedioMess.serialCode
        }).then(data => {
          if (data !== null) {
            vm.$Toast({
              message: '删除成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
            setTimeout(function () {
              vm.$router.back()
            }, 500)
          }
        })
      },
      subDel () {
        this.model_sure_del = true
      },
      getDate (time) {
        return getChangeDate(time)
      },
      getUuid () {
        return uuid().replace(/-/g, '')
      }
    },
    computed: {
      signate () {
        return this.$store.state.weChat.configData.signature
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
      let vm = this
      let _videoDetail = sessionStorage.getItem('currentVideoDetail')
      if (_videoDetail) {
        vm.userInfo = vm.$store.getters.getUserInfo
        _videoDetail = JSON.parse(_videoDetail)
        vm.snapshoot = _videoDetail.snapshoot
        vm.vedioMess = _videoDetail
        vm.vedioMess.produceTime = vm.getDate(vm.vedioMess.produceTime)
        this.init()
      } else {
        const index = location.href.indexOf('path=') + 5
        const end = location.href.indexOf('.mp4') + 4
        const host = location.href.slice(index, end)
        const index2 = location.href.indexOf('sp=') + 3
        const end2 = location.href.indexOf('&from')
        const host2 = location.href.slice(index2, end2)
        vm.vedioMess.path = decodeURIComponent(host)
        vm.snapshoot = decodeURIComponent(host2)
        vm.hasStorge = false
      }
    },
    mounted () {
      const vm = this
      const player = document.getElementById('m-vidwo-player')
      player.addEventListener('error', (e) => {
        vm.Toast.error('视频加载不成功')
      })
      player.addEventListener('stalled', (e) => {
        vm.Toast.error('网络太慢了')
      })
      //      if (vm.hasStorge) {
      //        const uuid = vm.getUuid()
      //        vm.shareVedio(vm.vedioMess.snapshoot, vm.vedioMess.path, vm.userInfo.nickName, uuid)
      //      }
    },
    beforeDestroy () {
      sessionStorage.removeItem('currentVideoDetail')
    }
  }
</script>
