<template>
  <div class="monitor">
    <!--轮播图-->
    <m-swipe :content="advertising" contentKey="imageUrl">
    </m-swipe>

    <div class="equiInforDisplay flex_at_cen" :class="[equiMessage.online ? 'bg_online' : 'bg_offline']" v-if="noshow">
      <div class="equiImg img_100">
        <img :src="equiMessage.equImg" alt="">
      </div>
      <div class="flex_col font_FFF_88_175">
        <span>设备型号：{{equiMessage.modelNo}}</span>
        <span>设备版本号：{{equiMessage.equVersion}}</span>
        <span>设备状态：{{equiMessage.online ? '在线' : '离线'}}</span>
      </div>
    </div>

    <!--一键接人、安装服务、服务网点、微信客服-->
    <div class="flex_wrap_bet" :class="[lg_sm ? 'monitorFunc_lg' : 'monitorFunc_sm']">
      <template  v-for="item in real_list">
        <a class="flex_center_col" v-if="wkwebview === true && item.name === '一键接人' && hasDevice" :href="getPickUrl()">
          <div class="monitorFunc_icon flex_center" :class="item.bgClass">
            <i :class="item.iconClass"></i>
          </div>
          <div class="monitorFunc_name font_7B_88">
            <span>{{item.name}}</span>
          </div>
        </a>
        <div class="flex_center_col" @click="jump(item.path)" :class="item.disClass" v-else>
          <div class="monitorFunc_icon flex_center" :class="item.bgClass">
            <i :class="item.iconClass"></i>
          </div>
          <div class="monitorFunc_name font_7B_88">
            <span>{{item.name}}</span>
          </div>
        </div>
      </template>
      <a @click="wechat_online" class="flex_center_col">
        <div class="monitorFunc_icon flex_center bg_wechatService">
          <i class="weui-icon-ai-headset"></i>
        </div>
        <div class="monitorFunc_name font_7B_88">
          <span>在线客服</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  const uuid = require('uuid/v4')
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        wkwebview: window.__wxjs_is_wkwebview,
//        wkwebview: true,
        keyedPeopleDirect: true,
        // 这是一键接人／违章查询等等信息
        noshow: false, // 不让显示
        real_list: [
          {
            name: '一键接人',
            bgClass: 'bg_one',
            path: `keyedPeople`,
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-car-connected'
          },
//          {
//            name: '违章查询',
//            bgClass: 'bg_two',
//            path: 'IllegalEnquiries',
//            unPath: '/views/monitoring/boundEquiries',
//            iconClass: 'weui-icon-ai-magnify'
//          },
          {
            name: '安装服务',
            bgClass: 'bg_three',
            path: 'InstallationServices',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-wrench'
          },
          {
            name: '服务网点',
            bgClass: 'bg_four',
            path: 'serviceOutlets',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-share-variant'
          },
          {
            // demo
            name: '流量查询',
            bgClass: 'bg_five',
            path: 'trafficQuery',
            unPath: '/views/monitoring/boundEquiries',
            iconClass: 'weui-icon-ai-traffic-query'
            //            ,disClass: 'greyStatu'
          }
        ],
        wechat_addr: '',
        lg_sm: '',
        equiMessage: {
          equImg: '',
          modelNo: '----',
          equVersion: '----',
          online: false
        },
        swipeData: []
      }
    },
    computed: {
      hasDevice () {
        return !!(this.$store.state.bindEquList && this.$store.state.bindEquList.imei)
      },
      equiInfo () {
        return this.$store.getters.getDefaultDevice
      },
      userInfo () {
        return this.$store.getters.getUserInfo
      },
      advertising () {
        return this.$store.state.equModelsAds
      }
    },
    methods: {
      init () {
        let vm = this
        if (vm.real_list.length > 5) {
          vm.lg_sm = false
        } else {
          vm.lg_sm = true
        }
        if (vm.hasDevice) {
          vm.$http.post(vm.$service.queryEquMoreInfo, {
            imei: vm.equiInfo.imei
          }).then(data => {
            if (data && data.data) {
              vm.equiMessage = data.data
            }
          })
        }
      },
      // 在线客服接口
      wechat_online (event) {
        event.preventDefault()
        if (!(this.equiInfo.imei && this.equiInfo.imei !== '')) {
          let random = Number.parseInt(Math.random() * Math.pow(10, 16))
          this.equiInfo.imei = random
        }
        this.$http.post(this.$service.urlEntryption, {
          deviceNo: this.equiInfo.imei,
          username: this.userInfo.userMobile,
          nickname: this.equiInfo.nickName,
          phone: this.userInfo.userMobile,
          cityCode: this.userInfo.city,
          navbarIsShow: 1
        }).then(data => {
          if (data && data.data && data.data.ciphertext) {
//            window.location.href = 'https://cmkf.cmcc-cs.cn:31210/api/nguac/h5/index/' + data.data.ciphertext
            window.location.href = 'http://120.194.44.248:31010/api/nguac/h5/index/' + data.data.ciphertext
          }
        })
      },
      getUUID () {
        return uuid().replace(/-/g, '')
      },
      jump (url) {
//        if (url === 'trafficQuery') {
//          this.$Toast({
//            message: '功能尚在开发，敬请期待！',
//            iconClass: 'weui-icon-warn',
//            duration: 800
//          })
//        } else {
//          this.$router.push({name: url})
//        }
        this.$router.push({name: url})
      },
      getPickUrl () {
        const index = location.href.indexOf('/views/')
        const host = location.href.substring(0, index)
        const serialCode = this.getUUID()
        return `${host}/share.html?serialeCode=${serialCode}&type=keyPeople`
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
      // 查询轮播图接口
      if (!this.advertising || !this.advertising.length) {
        this.$store.dispatch('getSwipeData')
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
