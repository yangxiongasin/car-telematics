<template>
    <div class="currentEquipment">
      <div class="noEqui flex_center border_bm_18" v-if="noEquiShow">
        <span class="font_7B_88_156">没有设备</span>
      </div>
      <div class="border_bm_18">
        <label class="weui-cell weui-check__label" v-if="!noEquiShow" v-for="(item, key) in dataEqu"  :for="'cE'+item.imei" @click="select_cE(item)">
          <div class="weui-cell__bd flex_col">
            {{item.nickName}}
          </div>
          <div class="weui-cell__ft">
            <input type="radio" name="currentEquipment" class="weui-check"
                   :id="'cE'+item.imei" :value="item.imei" v-model="currentEquipment">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
      <div class="del_foot" v-if="!hasTab"></div>
    </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        hasTab: false,
        currentEquipment: '',
        noEquiShow: true,
        dataEqu: ''
      }
    },
    methods: {
      init () {
        let vm = this
        console.log(vm.dataEqu)
        if (vm.dataEqu === null) {
          vm.noEquiShow = true
        } else {
          vm.noEquiShow = false
          for (let i = 0; i < vm.dataEqu.length; i++) {
            if (vm.dataEqu[i].default) {
              vm.currentEquipment = vm.dataEqu[i].imei
            }
          }
        }
      },
      select_cE (item) {
        let vm = this
        if (item.imei !== vm.currentEquipment) {
          vm.$http.post(vm.$service.inputEquPwdFalg, {
            imei: item.imei,
            operType: 2
          }).then(data => {
            if (data.data) {
              vm.$router.push({name: 'myEqui', params: {item: item}, query: {changeDefaultEqu: true}})
            } else {
              vm.$http.post(vm.$service.userInfo.changeDefaultEqu, {
                imei: item.imei
              }).then(data => {
                if (data !== null) {
                  vm.$store.dispatch('getBindEquList')
                  vm.$Toast({
                    message: '切换默认设备为:' + item.nickName,
                    iconClass: 'weui-icon-success-circle',
                    duration: 800
                  })
                  vm.$router.push({name: 'userinfoCar'})
                }
              })
            }
          })
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
      if (this.$route.query.hasTab === true) {
        this.hasTab = true
      } else {
        this.hasTab = false
      }
    },
    mounted () {
      let vm = this
      vm.dataEqu = this.$store.getters.getAllBindEquList
      vm.init()
    }
  }
</script>
