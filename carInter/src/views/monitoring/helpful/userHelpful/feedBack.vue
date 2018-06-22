<template>
    <div class="feedback">
      <textarea class="weui-textarea" placeholder="问题描述" rows="5" v-model="question"></textarea>
      <input class="weui-input mr_top_5" type="tel" placeholder="联系方式（必填）" v-model="phone" @blur="iptblur">
      <div>
        <div class="errorPhone flex_at_cen" v-show="errorPhone">
          <span class="font_FF_75">请输入正确手机号码！</span>
        </div>
        <div class="mr_top_10" v-show="!errorPhone"></div>
      </div>
      <m-button type="primary" size="large" @click="submit">提交</m-button>
    </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        question: '',
        phone: '',
        errorPhone: false
      }
    },
    methods: {
      submit () {
        let vm = this
        let mobile = /^1[3|4|5|7|8]\d{9}$/
        if (vm.question === '') {
          vm.$Toast({
            message: '问题描述不能为空',
            iconClass: 'weui-icon-error',
            duration: 800
          })
        } else if (!mobile.test(vm.phone)) {
          this.errorPhone = true
        } else {
          vm.$http.post(this.$service.helpful.feedback, {
            content: vm.question,
            contact: vm.phone
          }).then(data => {
            if (data !== null) {
              vm.$Toast({
                message: '反馈意见提交成功',
                iconClass: 'weui-icon-success-circle',
                duration: 800
              })
              vm.question = ''
              vm.phone = ''
            }
          })
        }
      },
      iptblur () {
        let mobile = /^1[3|4|5|7|8]\d{9}$/
        if (!mobile.test(this.phone)) {
          this.errorPhone = true
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    watch: {
      phone (val) {
        let mobile = /^1[3|4|5|7|8]\d{9}$/
        if (!mobile.test(val)) {
          this.errorPhone = false
        }
      }
    }
  }
</script>
