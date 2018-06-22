<template>
    <div class="myEqui">
      <div class="y_label flex_at_cen">
        <span class="font_7B_75" v-show="isChangeDefault">你将要切换的设备"{{mess.nickName}}"需要输入访问密码</span>
        <span class="font_7B_75" v-show="!isChangeDefault">你目前的默认设备"{{mess.nickName}}"需要输入访问密码</span>
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
        <span @click="switchDevice" v-if="switchDeviceShow" class="flex_end_end mr_top_125">
          <span class="font_2D_88 color_918_639">
            切换设备
          </span>
        </span>
      </div>

    </div>
</template>

<script>
  import wxMinxin from '../monitoring/mixin/wx-api'
  let numZimu = /^\d{4,6}$/g
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        isChangeDefault: false,
        redirectURL: `/views/monitoring/service`,
        mess: '',
        message: false,
        setAllBindEquList: '',
        validaNum: '',
        switchDeviceShow: true
      }
    },
    methods: {
      init () {
        this.mess = this.$route.params.item || this.bindEquList
        if (this.$route.query.changeDefaultEqu === true) { // from 设置默认设备
          this.switchDeviceShow = false
          this.isChangeDefault = true
        } else {
          this.setAllBindEquList = this.$store.getters.getAllBindEquList
          if (this.setAllBindEquList.length > 1) {
            this.switchDeviceShow = true
          } else {
            this.switchDeviceShow = false
          }
        }
      },
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
          vm.checkEquPwd()
        }
      },
      changeDefaultEqu () {
        const vm = this
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
            vm.$router.push({path: '/views/monitoring/userInfo', query: {directForward: true}})
          }
        })
      },
      checkEquPwd () {
        const vm = this
        vm.$http.post(this.$service.checkEquPwd, {
          imei: vm.mess.imei,
          equPassword: this.validaNum
        }).then(data => {
          if (data.data) {
            if (vm.isChangeDefault === true) {
              vm.changeDefaultEqu()
            } else {
              vm.$router.push(vm.redirectURL)
            }
          }
        })
      },
      switchDevice () {
        this.$router.push({name: 'currentEquipment'})
      }
    },
    computed: {
      bindEquList () {
        return this.$store.state.bindEquList
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
    mounted () {
      this.init()
    }
  }
</script>
