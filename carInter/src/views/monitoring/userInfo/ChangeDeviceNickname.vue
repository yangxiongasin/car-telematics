<template>
    <div class="ChangeDeviceNickname">
      <div class="flex_cen_bet border_bm_18">
        <input placeholder="请输入昵称" class="weui-input" maxlength="15"  v-model="name">
        <i class="weui-icon-clear" @click="clear"></i>
      </div>
      <div class="y_search_btn ">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="preservation">
          <span>保存</span>
        </button>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        name: '',
        mess: ''
      }
    },
    methods: {
      // 点击保存，验证姓名是否为空或者姓名是否与改前姓名一致
      preservation () {
        let vm = this
        if (vm.name === '') {
          vm.$Toast({
            message: `姓名不能为空`,
            iconClass: 'weui-icon-error',
            duration: 800
          })
        } else {
          vm.$http.post(vm.$service.userInfo.setEquNick, {
            imei: vm.mess.imei,
            nickName: vm.name
          }).then(data => {
            if (data !== null) {
              vm.$store.dispatch('getBindEquList', true)
              vm.$Toast({
                message: '设备昵称修改成功',
                iconClass: 'weui-icon-success-circle',
                duration: 800
              })
              vm.$router.push({name: 'userinfoCar', query: {directForward: true}})
            }
          })
        }
      },
      clear () {
        this.name = ''
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
      vm.mess = vm.$route.params.mess
      vm.name = vm.mess.nickName
    }
  }
</script>
