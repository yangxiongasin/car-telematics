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
    <div class="im_message">
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
          </span>
      </div>
    </div>

    <div class="im_map flex_center img_100" id="vedio-map-container">
      <span>地图</span>
    </div>

    <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_del">

    </m-action-sheet>
  </div>
</template>

<script>
  import {getChangeDate} from '@/utils/assist.js'

  const uuid = require('uuid/v4')

  export default {
    name: '',
    data () {
      return {
        playShow: true,
        snapshoot: '',
        userInfo: {
          headPortrait: '',
          nickName: '',
          sex: ''
        },
        defaultDevice: {
          address: '',
          imei: '',
          lat: 0,
          lng: 0,
          nickName: '',
          online: false,
          time: '',
          password: null
        },
        up_down_icon: true,
        menus: ['<div style="color:#ff5f5f;">确定删除</div>'], // actionSheet的子目录
        model_sure_del: false, // 底部删除图标显示状态
        vedioMess: {}
      }
    },
    props: {
      addr: {
        type: String,
        default: ''
      }
    },
    methods: {
      playVideo () {
        this.playShow = false
        this.$refs.playVideo.play()
      },
      init () {
        let vm = this
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.vedioMess.imei
        }).then((data) => {
          if (data) {
            let isOnline = data.data.online
            vm.$parent.initMap('vedio-map-container', isOnline, vm.vedioMess.lng, vm.vedioMess.lat)
          }
        })
      },

      shareVedio () {
        let vm = this
        const uuid = vm.$parent.getUuid()
        const snapshoot = vm.vedioMess.snapshoot
        const path = encodeURIComponent(vm.vedioMess.path)

        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        const link = `${host}/views/monitoring/monitor/video/videoDetail?serialeCode=${uuid}&path=${path}`
        const shareOption = {
          title: `${vm.userInfo.nickName}给您分享了视频`,
          link: link,
          imgUrl: snapshoot,
          desc: '我给您分享了视频!点击这里,可以观看视频内容',
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
      },

      // 确定删除
      sure_del (item, index) {
        let vm = this
        vm.model_sure_del = false
        vm.$http.post(this.$service.monitor.delMedia, {
          imei: vm.vedioMess.imei,
          serialCode: vm.vedioMess.serialCode
        }).then(data => {
          if (data !== null) {
            vm.$Toast({
              message: '删除成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
            setTimeout(() => {
              window.history.back()
            }, 800)
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
    created () {
      let vm = this
      const deviceCache = localStorage.getItem('setBindEquList')
      const userCache = localStorage.getItem('setUserInfo')
      vm.defaultDevice = JSON.parse(deviceCache)
      vm.userInfo = JSON.parse(userCache)
      let _videoDetail = localStorage.getItem('currentVideoDetail')
      vm.vedioMess = JSON.parse(_videoDetail)
      vm.snapshoot = vm.vedioMess.snapshoot
      vm.vedioMess.produceTime = vm.getDate(vm.vedioMess.produceTime)
      vm.init()
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
    }
  }
</script>
