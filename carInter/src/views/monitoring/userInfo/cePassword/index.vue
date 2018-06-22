<template>
  <div class="myEqui">
    <div class="y_label flex_at_cen">
      <span class="font_7B_75">你目前的默认设备"{{mess.nickName}}"需要输入访问密码</span>
    </div>
    <div class="flex_cen_bet border_bm_18">
      <input type="password" placeholder="输入4-6位数字密码" class="weui-input" v-model="validaNum">
      <i class="weui-icon-error" v-show="message"></i>
    </div>

    <div class="y_search_btn">
      <span @click="getPassword" class="flex_end_end mr_top_125 mr_bm_125">
        <span class="font_2D_88 color_918_639">如何获取密码</span>
      </span>
      <button class="weui-btn weui-btn_primary weui-btn_block" @click="submit">
        <span>确认</span>
      </button>
    </div>
    <div class="del_foot"></div>
  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'

  let numZimu = /^\d{4,6}$/g

  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        mess: '',
        message: false,
        setAllBindEquList: '',
        validaNum: ''
      }
    },
    methods: {
      getPassword () {
        this.$router.push({name: 'getPassword'})
      },
      submit () {
        let vm = this
        if (vm.message || vm.validaNum === '') {
          vm.$Toast({
            message: '密码错误',
            iconClass: 'weui-icon-error',
            duration: 800
          })
        } else {
          vm.$http.post(this.$service.checkEquPwd, {
            imei: vm.mess.imei,
            equPassword: this.validaNum
          }).then(data => {
            vm.$http.post(vm.$service.userInfo.changeDefaultEqu, {
              imei: vm.mess.imei
            }).then(data => {
              if (data !== null) {
                vm.$store.dispatch('getBindEquList')
                vm.$Toast({
                  message: '切换默认设备为:' + vm.mess.nickName,
                  iconClass: 'weui-icon-success-circle',
                  duration: 800
                })
                vm.$router.push({name: 'userHelpful'})
              }
            })
          })
        }
      }
    },
    watch: {
      validaNum (val) {
        if (!numZimu.test(val)) {
          this.message = true
        } else {
          this.message = false
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
      let vm = this
      vm.mess = vm.$route.params.item
    }
  }
</script>
