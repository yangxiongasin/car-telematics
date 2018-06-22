<template>
    <div class="installServiceDeatils">
      <div class="y_label flex_at_cen">
        <span class="font_7B_75">基础信息</span>
      </div>
      <div class="isd_content">
        <div class="weui-flex" v-for="item in installServiceDeatils_data">
          <span class="isd_title font_2D_88_156">{{item.name}}:</span>
          <span class="isd_details font_7B_88_156" v-html="item.details"></span>
        </div>
      </div>
      <div class="y_label flex_at_cen">
        <span class="font_7B_75">订单信息</span>
      </div>
      <div class="isd_content border_bm_18">
        <div class="weui-flex" v-for="item in installServiceDeatils_order_data">
          <span class="isd_title font_2D_88_156">{{item.name}}:</span>
          <span class="isd_details font_7B_88_156" v-html="item.details"></span>
        </div>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        // 基本信息
        installServiceDeatils_data: [
          {
            name: '客户姓名',
            details: ''
          },
          {
            name: '手机号码',
            details: ''
          },
          {
            name: '品牌车型',
            details: ''
          },
          {
            name: '具体地址',
            details: ''
          },
          {
            name: '选择门店',
            details: ''
          }
        ],
        // 订单信息
        installServiceDeatils_order_data: [
          {
            name: '订单号',
            details: ''
          },
          {
            name: '订单状态',
            details: ''
          },
          {
            name: '安装点',
            details: ''
          },
          {
            name: '安装地址',
            details: ''
          },
          {
            name: '门店电话',
            details: ''
          },
          {
            name: '验证码',
            details: ''
          }
        ],
        ISDData: '',
        imei: ''
      }
    },
    methods: {
      init () {
        let vm = this
        vm.$http.post(vm.$service.service.getOrderInfo, {
          imei: vm.imei
        }).then(data => {
          if (data.data) {
            vm.ISDData = data.data
            switch (vm.ISDData.orderStatus) {
              case '0' : vm.ISDData.orderStatus = '订单已接收'; break
              case '1' : vm.ISDData.orderStatus = '订单已派单'; break
              case '2' : vm.ISDData.orderStatus = '订单已完成'; break
              case '004' : vm.ISDData.orderStatus = '已派单订单'; break
              case '005' : vm.ISDData.orderStatus = '已完工未确认'; break
              case '006' : vm.ISDData.orderStatus = '已确认完工'; break
              case '007' : vm.ISDData.orderStatus = '已完成订单'; break
            }
            this.setInstallServiceDeatils()
          }
        })
      },
      setInstallServiceDeatils () {
        let vm = this
        vm.installServiceDeatils_data[0].details = vm.ISDData.customerName
        vm.installServiceDeatils_data[1].details = vm.ISDData.customerMobile
        vm.installServiceDeatils_data[2].details = vm.ISDData.carBrand + vm.ISDData.carModel
        vm.installServiceDeatils_data[3].details = vm.ISDData.customerAddr
        vm.installServiceDeatils_data[4].details = vm.ISDData.dotName
        // 订单信息值
        vm.installServiceDeatils_order_data[0].details = vm.ISDData.orderId
        vm.installServiceDeatils_order_data[1].details = vm.ISDData.orderStatus
        vm.installServiceDeatils_order_data[2].details = vm.ISDData.dotName
        vm.installServiceDeatils_order_data[3].details = vm.ISDData.dotAddr
        vm.installServiceDeatils_order_data[4].details = vm.ISDData.contactMobile
        if (!vm.ISDData.verificationCode) {
          vm.installServiceDeatils_order_data[5].details = '------'
        } else {
          vm.installServiceDeatils_order_data[5].details = vm.ISDData.verificationCode
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
      this.imei = this.$route.params.message
      this.init()
    }
  }
</script>
