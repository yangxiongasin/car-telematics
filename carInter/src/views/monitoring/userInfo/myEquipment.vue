<template>
    <div class="myEquiment">
      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">设备昵称</div>
        <div @click="ChangeDeviceNickname" class="font_7B_15">
          <span class="font_7B_15">{{dataEqu.nickName}}</span>
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>

      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">IMEI</div>
        <div class="font_7B_15">
          <span class="font_7B_15">{{dataEqu.imei}}</span>
        </div>
      </div>

      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">状态</div>
        <div class="font_7B_15">
          <span class="font_7B_15">{{dataEqu.online?'在线':'离线'}}</span>
        </div>
      </div>

      <div class="y_search_btn">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="isShowActionSheet=true">
          <span>解除绑定</span>
        </button>
      </div>

      <m-action-sheet v-model="isShowActionSheet" titleText="解除绑定此设备"
                      :menus="menus" @menu-item-click="handleMenuClick"></m-action-sheet>
    </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        isShowActionSheet: false,
        menus: ['<span style="color: #ff5f5f;">解绑设备</span>']
      }
    },
    methods: {
      // 改变设备昵称
      ChangeDeviceNickname () {
        this.$router.push({name: 'ChangeDeviceNickname', params: {mess: this.dataEqu}})
      },
      handleMenuClick (item, index) {
        let vm = this
        vm.$http.post(this.$service.userInfo.unBindEqu, {
          imei: vm.dataEqu.imei
        }).then(data => {
          if (data) {
            vm.$Toast({
              message: '解绑设备成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
            vm.$store.dispatch('getBindEquList')
            this.$router.push({name: 'monitorCar'})
          }
        })
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    computed: {
      dataEqu () {
        return this.$store.state.SelectEqui
      }
    },
    created () {
      // 检查设备在线状态
      this.$store.dispatch('equOnlinStatus', this.dataEqu.imei)
    }
  }
</script>
