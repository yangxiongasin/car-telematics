<template>
  <div class="trafficQuery">
    <div class="flex_at_cen trafficQuery_top">
      <div class="trafficQuery_top_icon flex_center">
        <i class="weui-icon-ai-sim-card"></i>
      </div>
      <div class="font_FFF_175 flex_col">
        <span>物联网号码：<i>{{packageFlow.msisdn}}</i></span>
        <span>物联网卡号：
          <i>{{packageFlow.iccid}}</i>&nbsp;&nbsp;
          <!--<span class="copy" v-clipboard:copy="packageFlow.iccid">复制</span>-->
        </span>
      </div>
    </div>

    <div class="trafficQuery_center flex_cen_bet">
      <div class="">
        <span class="font_2D_1">套餐内流量使用情况</span>
        <div class="use_detail flex_col font_7B_85_175">
          <span>本月套餐总量：<i>{{comboSum}}</i></span>
          <span>本月套餐使用量：<i>{{comboWithinSum}}</i></span>
        </div>
      </div>
      <div class="circular_code">
        <m-circular-progress fillColor="#808cf7" circular_color="#ffffff" bg_Color="#f1f4f6" :progress="progress" :size="progressSize" ref="circlu"></m-circular-progress>
        <div class="available_flow flex_col font_2D_88 ">
          <span class="color_918_639"><i class="big">{{comboRemaining}}</i>
            <span v-show="toggle_MG">M</span>
            <span v-show="!toggle_MG">G</span>
          </span>
          <span class="color_918_639 small">可用流量</span>
        </div>
      </div>
    </div>

    <div class="trafficQuery_contain">
      <div class="flex_cen_bet y_cell border_bm_18" v-for="(item, index) in package_data" :key="index">
        <div class="font_2D_88">{{item.name}}</div>
        <div class="font_7B_15">
          <span class="font_7B_15">{{item.value}}</span>
        </div>
      </div>
      <div class="flex_cen_bet y_cell border_bm_18" style="padding-right: 0.5rem; display: none" @click="top_up_payment">
        <div class="font_2D_88 color_918_639">充值缴费</div>
        <div class="font_7B_15">
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>
    </div>

    <div class="trafficQuery_foot text_left font_7B_88">
      <span> 1.本页面仅能查询物联网卡流量。<br>
2.以上数据仅供参考，数据存在一定延迟，最终结果请以发卡省账单为准。</span>
    </div>

  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        msg: '',
        progressSize: 8.19, // 环形图的大小
        toggle_MG: true,
        packageFlow: {
          comboSum: '0', // 套餐总量
          comboWithinSum: '0', // 套内使用量
          comboOuterSum: 0, // 套外使用量
          iccid: '--', // 物联网卡号
          msisdn: '--' // 物联网号码
        },
        package_data: [
          {
            name: '套餐外流量使用',
            value: '--'
          },
          {
            name: '本月累计使用量',
            value: '--'
          },
          {
            name: '当月余额',
            value: '--元'
          }
        ]
      }
    },
    computed: {
      comboSum () {
        const vm = this
        const all = Number.parseFloat(vm.packageFlow.comboSum)
        const value = vm.unit_conversion(all)
        return value
      },
      comboWithinSum () {
        const vm = this
        let all = Number.parseFloat(vm.packageFlow.comboWithinSum)
        const value = vm.unit_conversion(all)
        return value
      },
      comboOuterSum () {
        let vm = this
        let all = Number.parseFloat(vm.packageFlow.comboOuterSum)
        const value = vm.unit_conversion(all)
        return value
      },
      // 环形图的进度 最大值为99.99
      progress () {
        let vm = this
        let all = Number.parseFloat(vm.packageFlow.comboSum)
        let whithin = Number.parseFloat(vm.packageFlow.comboWithinSum)
        let num
        if (all === 0) {
          num = 0
        } else {
          num = (all - whithin) / all * 100
        }
        return num
      },
      comboRemaining () {
        const vm = this
        let val
        const all = Number.parseFloat(vm.packageFlow.comboSum) - Number.parseFloat(vm.packageFlow.comboWithinSum)
        if (all >= 1024) {
          vm.toggle_MG = false
          val = (Number.parseInt((all / 1024) * 100) / 100).toFixed(2)
          return val
        } else {
          vm.toggle_MG = true
          val = (Number.parseInt(all * 100) / 100).toFixed(2)
          return val
        }
      }
    },
    methods: {
      init () {
        const vm = this
        let imei = this.$store.getters.getDefaultDevice.imei
        vm.$http.post(vm.$service.service.packageFlow, {
          imei: imei
        }).then(data => {
          if (data && data.data) {
            vm.packageFlow = data.data
            vm.package_data[0].value = vm.unit_conversion(Number(vm.packageFlow.comboOuterSum))
            let value = Number.parseFloat(vm.packageFlow.comboOuterSum) + Number.parseFloat(vm.packageFlow.comboWithinSum)
            vm.package_data[1].value = vm.unit_conversion(value)
          }
        })
        vm.$http.post(vm.$service.service.balance, {
          imei: imei
        }).then(data => {
          if (data && data.data) {
            vm.package_data[2].value = data.data.balance + '元'
          }
        })
      },
      unit_conversion (value) {
        let val
        if (value >= 1024) {
          val = Number.parseInt((value / 1024) * 100) / 100
          console.log(val)
          return val.toFixed(2) + 'G'
        } else {
          val = Number.parseInt(value * 100) / 100
          return value.toFixed(2) + 'M'
        }
      },
      top_up_payment () {
        this.$Toast({
          message: '功能尚在开发，敬请期待！',
          iconClass: 'weui-icon-success-circle',
          duration: 800
        })
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.init()
    }
  }
</script>
