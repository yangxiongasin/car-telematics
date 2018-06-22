<template>
    <div class="changePhoneNum">
      <m-verification-code :timeData="30" smsType="1" @setInputValue="getValue" class="border_bm_18"></m-verification-code>
      <div class="flex_cen_bet border_bm_18">
        <input placeholder="输入验证码" class="weui-input" v-model="validaNum">
      </div>
      <div class="y_search_btn ">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="confirmChange">
          <span>确认</span>
        </button>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  let mobile = /^1[3|4|5|6|7|8]\d{9}$/
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        banding_num: '', // 当前绑定手机号
        updateNum: '', // 准备更改的手机号
        validaNum: '' // 验证码
      }
    },
    methods: {
      getValue (val) {
        this.updateNum = val
      },
      // 扫码进来并未绑定过手机的需要调用绑定
      bindPhone () {
        const vm = this
        vm.$http.post(this.$service.bindPhone, {
          phone: vm.updateNum,
          smsCode: vm.validaNum
        }).then(data => {
          if (data) {
            // 刷新用户信息
            vm.$store.dispatch('getUserInfo')
            // vm.Toast.success('手机号码设置成功!')
            vm.$router.push('/views/monitoring/userInfo')
          }
        })
      },
      // 已存在手机号,进行修改
      changePhone () {
        const vm = this
        vm.$http.post(this.$service.userInfo.getChangeBindPhone, {
          oldPhone: vm.banding_num,
          newPhone: vm.updateNum,
          smsCode: vm.validaNum
        }).then(data => {
          if (data !== null) {
            vm.$store.dispatch('getUserInfo')
            vm.$router.push({name: 'userinfoCar'})
          }
        })
      },
      checkValid () {
        const vm = this
        if (!vm.updateNum) {
          vm.Toast.error('请输入手机号码')
          return false
        }
        if (!mobile.test(vm.updateNum)) {
          vm.Toast.error('请输入正确的手机号码')
          return false
        }
        if (!vm.validaNum) {
          vm.Toast.error('请输入验证码')
          return false
        }
        return true
      },
      // 提交确认
      confirmChange () {
        const vm = this
        if (vm.checkValid() === false) {
          return
        }
        if (vm.banding_num) {
          vm.changePhone()
        } else {
          vm.bindPhone()
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.banding_num = this.$route.params.num
    }
  }
</script>
