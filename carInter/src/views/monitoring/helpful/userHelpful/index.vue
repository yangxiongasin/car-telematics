<template>
    <div class="userHelpful">
      <div class="flex_cen_bet border_bm_18 y_cell" v-for="item in data" @click="lookDetails(item.src)">
        <div class="weui-flex">
          <div class="head_img flex_center" :class="item.bg_class">
            <i :class="item.icon_class"></i>
          </div>
          <div class="flex_center font_2D_106_156">
            <span>{{item.text}}</span>
          </div>
        </div>
        <div class="weui-flex status" >
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        data: [
          {
            src: this.$service.helpful.userGuideBindWx,
            text: '设备如何绑定微信公众号',
            bg_class: 'head_img_3',
            icon_class: 'weui-icon-ai-wechat'
          },
          {
            src: this.$service.helpful.userGuideVoice,
            text: '语音助手语义表',
            bg_class: 'head_img_4',
            icon_class: 'weui-icon-ai-microphone'
          },
          {
            src: this.$service.helpful.userGuideWxConnect,
            text: '微信互联功能详解',
            bg_class: 'head_img_5',
            icon_class: 'weui-icon-ai-all-inclusive'
          },
          {
            src: 'feedBack',
            text: '意见反馈',
            bg_class: 'head_img_6',
            icon_class: 'weui-icon-ai-comment-text-outline'
          }
        ],
        msg: ''
      }
    },
    methods: {
      lookDetails (item) {
        let vm = this
        if (item === 'feedBack') {
          this.$router.push({name: item})
        } else {
          this.$http.post(item, null).then(data => {
            vm.msg = data.data
            vm.$router.push({name: 'userDetail', params: {id: vm.msg}})
          })
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    }
  }
</script>
