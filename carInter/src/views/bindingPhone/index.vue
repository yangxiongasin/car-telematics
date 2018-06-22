<template>
    <div class="bindingPhone">
      <div class="bindingPhone_head flex_center_col">
        <div class="bindingPhone_bg_img flex_center">
          <i class="weui-icon-ai-cellphone-iphone"></i>
        </div>
        <span class="font_2D bindingPhone_num">绑定手机号</span>
        <span class="font_7B_88">以获得更多操作</span>
      </div>
      <div class="bindingPhone_form">
        <m-verification-code :timeData="30" smsType="1" @setInputValue="getValue" class="weui-cell"></m-verification-code>

        <div class="weui-cell weui-cell_vcode mr_bm_0">
          <div class="weui-cell__bd flex_cen_bet">
            <input class="weui-input" type="tel" placeholder="输入验证码" v-model="bound_code">
            <i class="weui-icon-error flex_center ft13" v-show="bound_code_error"></i>
          </div>
        </div>

        <button class="weui-btn weui-btn_primary weui-btn_block" @click="submit_form">
          <span>确认</span>
        </button>

        <button class="weui-btn weui-btn_default weui-btn_block mr_top_5" @click="cancel_bound">
          <span>取消</span>
        </button>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../monitoring/mixin/wx-api'
  import wx from 'weixin-js-sdk'

  let mobile = /^1[3|4|5|6|7|8]\d{9}$/
  let code = /^\d{4,6}$/
  let fromPath = ''

  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        bound_number: '', // 手机号码
        bound_code: '', // 验证码
        bound_code_error: false // 验证码错误提示
      }
    },
    beforeRouteEnter (to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      fromPath = from.path
      next()
    },
    methods: {
      // 将‘m-verification-code’组件传过来的值赋给‘手机号’
      getValue (val) {
        this.bound_number = val
      },
      cancel_bound () { // 取消绑定
        const currentPath = this.$route.path
        if (!fromPath || currentPath === fromPath) {
          this.$router.push({name: 'monitorCar'})
        } else {
          wx.closeWindow()
        }
      },
      // 点击确认进行号码和验证码输入框的验证，验证通过就跳转页面
      submit_form () {
        let vm = this
        if (vm.checkValid()) {
          vm.$http.post(this.$service.bindPhone, {
            phone: this.bound_number,
            smsCode: vm.bound_code
          }).then(data => {
            if (data) {
              // 刷新用户信息
              vm.$store.dispatch('getUserInfo')
              vm.$router.push({name: 'serviceCar'})
            }
          }).catch(() => {
            vm.Toast.error('绑定手机失败')
          })
        }
      },
      checkValid () {
        const vm = this
        if (!vm.bound_number) {
          vm.Toast.error('请输入手机号码')
          return false
        }
        if (!mobile.test(vm.bound_number)) {
          vm.Toast.error('请输入正确的手机号码')
          return false
        }
        if (!vm.bound_code) {
          vm.Toast.error('请输入验证码')
          vm.bound_code_error = true
          return false
        }
        if (!code.test(vm.bound_code)) {
          vm.Toast.error('请输入正确验证码')
          vm.bound_code_error = true
          return false
        }
        return true
      }
    },
    watch: {
      bound_code (val) {
        if (code.test(this.bound_code)) {
          this.bound_code_error = false
        }
      }
    }
  }
</script>
