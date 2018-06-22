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

    <div class="ContactInformation flex_center_col">
      <i class="weui-icon-ai-account-outline"></i>
      <span class="font_2D pd_100">联系我们</span>
      <span class="font_7B_88 pd_156">如果您需要咨询、提出建议或者投诉</span>
      <div class="weui-flex pd_63">
        <span class="blue_bg flex_center">
          <i class="weui-icon-ai-phone"></i>
        </span>
        <span class="font_2D_88">4001008655</span>
      </div>
      <div class="weui-flex pd_63">
        <span class="blue_bg flex_center">
          <i class="weui-icon-ai-email-outline"></i>
        </span>
        <span class="font_2D_88">Tsupport@chinamobile.com</span>
      </div>
    </div>
  </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data: function () {  // store data
      return {
        data: [
          {
            src: this.$service.helpful.QA,
            text: 'Q&A',
            bg_class: 'head_img_1',
            icon_class: 'weui-icon-ai-rearview-mirror'
          },
          {
            src: 'userHelpful',
            text: '使用指南',
            bg_class: 'head_img_2',
            icon_class: 'weui-icon-ai-book-open-page-variant'
          }
        ]
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    methods: {
      lookDetails (item) {
        let vm = this
        const imei = vm.$store.state.bindEquList.imei
        if (item !== 'userHelpful') {
          if (imei === null) {
            this.$router.push({name: 'boundEquiries'})
          } else {
            this.$http.post(item, {
              imei: imei
            }).then(data => {
              vm.msg = data.data
              vm.$router.push({name: 'userDetail', params: {id: vm.msg}})
            })
          }
        } else {
          this.$router.push({name: 'userHelpful'})
        }
      }
    }
  }
</script>
