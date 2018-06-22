<template>
    <div class="lllegalEnquiries">
      <div class="label_input">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">车牌号码</span>
        </div>
        <div class="y_input flex_cen_bet">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <div class="provinces font_2D_88">京</div>
            <input class="weui-input" type="tel" placeholder="输入车牌号" v-model="LicensePlate">
          </div>
          <i class="weui-icon-error icon" v-show="LicensePlateShow"></i>
        </div>
      </div>

      <div class="label_input">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">车架号码</span>
        </div>
        <div class="y_input flex_cen_bet">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" type="tel" placeholder="输入完整车架号" v-model="TruckFrame">
          </div>
          <i class="weui-icon-error icon" v-show="TruckFrameShow"></i>
        </div>
      </div>

      <div class="label_input border_bm_18">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">发动机号</span>
        </div>
        <div class="y_input flex_cen_bet">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" type="tel" placeholder="输入完整发动机号" v-model="EngineNumber">
          </div>
          <i class="weui-icon-error icon" v-show="EngineNumberShow"></i>
        </div>
      </div>

      <div class="y_search_btn">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="start_search">
          <i class="weui-icon-search"></i>
          <span>开始查询</span>
        </button>
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
        LicensePlateShow: false,
        TruckFrameShow: false,
        EngineNumberShow: false,
        LicensePlate: '',
        TruckFrame: '',
        EngineNumber: ''
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    methods: {
      start_search () {
        let vm = this
        if (vm.LicensePlate === '') {
          vm.LicensePlateShow = true
        } else {
          vm.LicensePlateShow = false
        }
        if (vm.TruckFrame === '') {
          vm.TruckFrameShow = true
        } else {
          vm.TruckFrameShow = false
        }
        if (vm.EngineNumber === '') {
          vm.EngineNumberShow = true
        } else {
          vm.EngineNumberShow = false
        }
      }
    }
  }
</script>
