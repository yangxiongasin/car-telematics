<template>
  <div class="mediaDetails">
    <div class="im_top img_100">
      <img v-lazy="imageMess.path" alt="">
    </div>
    <div class="im_message">
      <div class="im_time_icon flex_wrap_bet">
        <div class="im_time font_7B_75">{{imageMess.produceTime?imageMess.produceTime:'null'}}</div>
        <div class="im_icon" @click="submit_delete">
          <i class="weui-icon-delete "></i>
        </div>
      </div>
      <div class="im_address mr_top_5 weui-flex">
          <span class="im_dingwei ">
            <i class="weui-icon-ai-map-marker"></i>
          </span>
        <span class="im_addr font_2D_1">
            {{addr}}
          </span>
      </div>
    </div>

    <div class="im_map flex_center" id="image-map-container">
      <span>地图</span>
    </div>

    <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_delete">

    </m-action-sheet>
  </div>
</template>

<script>
  import {getChangeDate} from '@/utils/assist.js'

  export default {
    name: '',
    data () {
      return {
        imageMess: {},
        up_down_icon: true,
        menus: ['<div style="color:#ff5f5f;">确定删除</div>'], // actionSheet的子目录
        model_sure_del: false // 底部删除图标显示状态
      }
    },
    props: {
      addr: {
        type: String,
        default: ''
      }
    },
    methods: {
      init () {
        let vm = this
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.imageMess.imei
        }).then((data) => {
          if (data) {
            let isOnline = data.data.online
            vm.$parent.initMap('image-map-container', isOnline, vm.imageMess.lng, vm.imageMess.lat)
          }
        })
      },
      shareImage () {
        let vm = this
        const uuid = vm.$parent.getUuid()
        let path = vm.imageMess.path
        let eUpath = encodeURIComponent(path)
        const index = location.href.indexOf('/share.html')
        const host = location.href.substring(0, index)
        const link = `${host}/views/monitoring/monitor/imageDetail?serialeCode=${uuid}&path=${eUpath}`
        const shareOption = {
          title: `${vm.userInfo.nickName}给您分享了图片`,
          link: link,
          imgUrl: path,
          desc: '我给您分享了图片!点击这里,可以观看图片详情',
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
      sure_delete (item, index) {
        let vm = this
        vm.model_sure_del = false
        vm.$http.post(this.$service.monitor.delMedia, {
          imei: vm.vedioMess.imei,
          serialCode: vm.imageMess.serialCode
        }).then(data => {
          if (data !== null) {
            vm.$Toast({
              message: '删除成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
          }
          setTimeout(function () {
            window.history.back()
          }, 800)
        })
      },
      submit_delete () {
        this.model_sure_del = true
      },
      getDate (time) {
        return getChangeDate(time)
      }
    },
    created () {
      let vm = this
      const deviceCache = localStorage.getItem('setBindEquList')
      const userCache = localStorage.getItem('setUserInfo')
      vm.defaultDevice = JSON.parse(deviceCache)
      vm.userInfo = JSON.parse(userCache)
      let _imageDetail = localStorage.getItem('currentImageDetail')
      vm.imageMess = JSON.parse(_imageDetail)
      vm.imageMess.produceTime = vm.getDate(vm.imageMess.produceTime)
      vm.init()
    }
  }
</script>
