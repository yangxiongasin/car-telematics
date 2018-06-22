<template>
    <div class="selectFacility">
      <div class="fac_title flex_center font_2D">
        请选择您的设备
      </div>
      <div class="facilityType" >
        <div v-show="noDevice === true" class="font_7B_88" style="text-align: center">无可选设备</div>
        <div class="flex_sta_bet" v-show="noDevice === false">
          <div v-for="(item, index) in productModel" :key="index" class="facilityType_details" @click="selFacility(item)">
            <div class="typeImg">
              <img v-lazy="item.modelImage" alt="">
            </div>
            <div class="typeName font_7B_88" >
              {{item.modelName}}<br>{{item.modelNo}}
            </div>
          </div>
        </div>
      </div>
      <div class="fac_foot flex_center_col">
          <div class="fac_foot_code flex_center" @click="scanFacility">
            <i class="weui-icon-ai-barcode-scan"></i>
          </div>
          <div class="fac_foot_content font_7B_88">
            若您无法区别设备型号
            请扫描条形码
          </div>
          <div class="fac_foot_help font_7B_88" @click="findImei">如何找到？</div>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../monitoring/mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        noDevice: false,
        productModel: []
      }
    },
    methods: {
      // 调用设备接口
      getFacilityInfo () {
        let vm = this
        vm.$http.post(this.$service.getEquModels, {
          equType: ''
        }).then(data => {
          if (data && data.data) {
            vm.productModel = data.data
          } else {
            vm.noDevice = true
          }
        })
      },
      selFacility (item) {
        let vm = this
        // 判断设备是否是新设备，
        if (item.isNew === '1') {
          // 判断该用户是否有userMobile，有的话跳到监控页面，没有则跳到绑定手机页面
          vm.$http.post(this.$service.userInfoo, {}).then(data => {
            // 设置用户信息到store
            localStorage.setItem('setUserInfo', JSON.stringify(data.data))
            vm.$store.commit('setUserInfo', data.data)
            if (data.data.userMobile === '') {
              vm.$router.push(`/views/bindingPhone`)
            } else {
//              vm.getBindEquList()
              vm.$router.push(`/views/monitoring/service`)
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('你选择的是旧设备')
        }
      },
      // 进入扫描设备
      scanFacility () {
        let vm = this
        vm.scanBarCode((imei) => {
          vm.getEquModelRoute(imei)
        })
      },
      getEquModelRoute (imei) {
        if (!imei) {
          return
        }
        let vm = this
        vm.$http.post(this.$service.getEquModelRoute, {
          imei: imei || ''
        }).then(data => {
          if (data.data === 1) {
            vm.$router.push(`/views/monitoring/service`)
          }
        })
      },
      findImei () {
        this.$Dialog({
          message: `<div class="y_IMEI">
                      <div class="IMEI_title">
                          IMEI号位于包装盒侧边或设备背部
                      </div>
                      <div class="IMEI_img flex_at_cen">
                        <i class="weui-icon-ai-chinamobile"></i>
                        <div class="flex_col IMEI_type">
                          <div>4G智能后视镜</div>
                          <div>型号：2611</div>
                          <div style="border: 2px solid #f00;">IMEI:<i class="weui-icon-ai-bar-code"></i>
                          </div>
                        </div>
                      </div>
                    </div>`,
          iconClass: 'weui-icon-ai-emoticon-happy color_918'
        })
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
    },
    mounted () {
      this.getFacilityInfo()
    }
  }
</script>
