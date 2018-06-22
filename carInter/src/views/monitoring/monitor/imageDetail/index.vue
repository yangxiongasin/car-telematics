<template>
    <div class="mediaDetails">
      <div class="im_top img_100">
        <img v-lazy="imageMess.path" alt="">
      </div>
      <div class="im_message" v-if='hasStorge'>
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
            <span @click="toggleMap" class="im_icon_up_down" v-if="false">
              <i :class="[up_down_icon ? 'weui-icon-ai-chevron-down' : 'weui-icon-ai-chevron-up']"></i>
            </span>
          </span>
        </div>
      </div>

      <div class="im_map flex_center" id="image-map-container" v-show="mapShow && hasStorge" >
        <span>地图</span>
      </div>

      <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_delete">

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
        imageMess: {},
        up_down_icon: true,
//        mapShow: false,
        mapShow: true,
        hasStorge: true,
        userInfo: {},
        menus: ['<div style="color:#ff5f5f;">确定删除</div>'], // actionSheet的子目录
        model_sure_del: false // 底部删除图标显示状态
      }
    },
    methods: {
      toggleMap () {
        this.up_down_icon = !this.up_down_icon
        this.mapShow = !this.mapShow
      },
      init () {
        let vm = this
        vm.$http.post(vm.$service.equOnlinStatus, {
          imei: vm.imageMess.imei
        }).then((data) => {
          if (data) {
            let isOnline = data.data.online
            vm.initMap('image-map-container', isOnline, vm.imageMess.lng, vm.imageMess.lat)
          }
        })
      },
      // 确定删除
      sure_delete (item, index) {
        let vm = this
        let BindEquList = this.$store.getters.getDefaultDevice
        vm.model_sure_del = false
        vm.$http.post(this.$service.monitor.delMedia, {
          imei: BindEquList.imei,
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
            vm.$router.back()
          }, 500)
        })
      },
      submit_delete () {
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
      let _imageDetail = sessionStorage.getItem('currentImageDetail')
      if (_imageDetail) {
        vm.userInfo = vm.$store.getters.getUserInfo
        _imageDetail = JSON.parse(_imageDetail)
        vm.imageMess = _imageDetail
        vm.imageMess.produceTime = vm.getDate(vm.imageMess.produceTime)
        vm.init()
      } else {
        const index = location.href.indexOf('path=') + 5
        const end = location.href.indexOf('&from')
        const host = location.href.substring(index, end)
        vm.imageMess.path = decodeURIComponent(host)
        vm.hasStorge = false
      }
    },
    //    mounted () {
    //      const vm = this
    //      if (vm.hasStorge) {
    //        const uuid = vm.getUuid()
    //        vm.shareImage(vm.imageMess.path, vm.userInfo.nickName, uuid)
    //      }
    //    },
    beforeDestroy () {
      sessionStorage.removeItem('currentImageDetail')
    }
  }
</script>
