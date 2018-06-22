<template>
  <div class="verificationCode flex_cen_bet">
    <div class="flex_cen_bet verificationCode_input" :class="{'disabled': input_disabled}">
      <input placeholder="输入手机号码" class="weui-input"
             v-model="input_data" :disabled="input_disabled" @change="set_phone_num">
      <i class="weui-icon-error" v-show="phoneNum_error"></i>
    </div>
    <div class="veriCode" :class="{'border-left': !input_disabled}">
      <div @click="getVerificationCode" v-show="veriCode_status">
        <span class="font_2D_88 color_918_639">获取验证码</span>
      </div>
      <div v-show="!veriCode_status">
        <span class="font_2D_88 color_918_639">
          重新发送({{time+1}}s)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  let mobile = /^1[3|4|5|6|7|8|9]\d{9}$/
  export default {
    name: '',
    data () {
      return {
        veriCode_status: true,
        input_disabled: false,
        phoneNum_error: false,
        input_data: '',
        time: 0,
        last_click_time: 0
      }
    },
    props: {
      timeData: {
        type: Number,
        default: 30
      },
      smsType: {
        default: '1'
      }
    },
    methods: {
      getVerificationCode () {
        let vm = this
        let timeInterval = new Date().getTime() - vm.last_click_time
        vm.last_click_time = new Date().getTime()
        // 如果号码验证成功并且点击的时间间隔大于一秒那么就可以执行
        if (mobile.test(vm.input_data) && timeInterval > 1000) {
          vm.ipt_err = false
          vm.time = vm.timeData
          vm.countDown()
          vm.$http.post(this.$service.monitor.getMobileSendSms, {
            phone: vm.input_data,
            smsType: vm.smsType
          }).then(data => {
            vm.$Toast({
              message: data.resultDesc,
              iconClass: 'weui-icon-success-circle',
              duration: 500
            })
            vm.veriCode_status = false
            vm.input_disabled = true
          }).catch(error => {
            console.log(error)
          })
        } else if (vm.input_data === '') {
          vm.$Toast({
            message: '号码不能为空',
            iconClass: 'weui-icon-error',
            duration: 500
          })
        } else if (!mobile.test(vm.input_data)) {
          this.phoneNum_error = true
        }
      },
      set_phone_num () {
        this.$emit('setInputValue', this.input_data)
      },
      countDown () {
        let vm = this
        if (vm.time === 0) {
          vm.veriCode_status = true
          vm.input_disabled = false
        } else {
          vm.time--
          setTimeout(function () {
            vm.countDown()
          }, 1000)
        }
      }
    },
    watch: {
      input_data (val) {
        if (mobile.test(val)) {
          this.phoneNum_error = false
        }
      }
    }
  }
</script>
