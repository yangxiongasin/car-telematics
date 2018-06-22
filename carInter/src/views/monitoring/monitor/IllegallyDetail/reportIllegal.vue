<template>
  <div class="serviceOutlets reports">
    <div class="y_label flex_at_cen">
      <span class="font_7B_75">输入举报者信息</span>
    </div>

    <div class="y_input flex_cen_bet border_bm_18">
      <div class="flex_at_cen">
        <div class="flex_center star">*</div>
        <input class="weui-input" placeholder="姓名" v-model="reportName">
      </div>
      <i class="weui-icon-error icon" v-show="nameShow"></i>
    </div>

    <div class="y_input flex_cen_bet border_bm_18">
      <div class="flex_at_cen">
        <div class="flex_center star">*</div>
        <input class="weui-input" placeholder="手机号" v-model="reportPhone">
      </div>
      <i class="weui-icon-error icon" v-show="phoneShow"></i>
    </div>

    <div class="y_input flex_cen_bet border_bm_18">
      <div class="flex_at_cen">
        <div class="flex_center star">*</div>
        <input class="weui-input" placeholder="身份证号码" v-model="reportId">
      </div>
      <i class="weui-icon-error icon" v-show="idShow"></i>
    </div>

    <div class="y_input flex_cen_bet border_bm_18" @click="model_sure_del = true">
      <div class="flex_at_cen">
        <div class="flex_center star">*</div>
        <input class="weui-input" placeholder="违章行为" readonly v-model="reportBehave">
      </div>
      <i class="weui-icon-error icon" v-show="behaveShow"></i>
    </div>

    <div class="y_search_btn">
      <button class="weui-btn weui-btn_primary weui-btn_block" @click="start_search">
        <span>提交</span>
      </button>
    </div>

    <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_del">
    </m-action-sheet>
  </div>
</template>

<script>
  let mobile = /^1[3|4|5|6|7|8]\d{9}$/
  let idCard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
  export default {
    name: '',
    data () {
      return {
        vedioid: '',
        menus: ['驾驶机动车走非机动车道行驶',
          '在禁行期间占用公交车道行驶',
          '机动车在城市快速道路上违法占用应急车道行驾驶',
          '机动车在高速公路遇交通拥堵占用应急车道行驶',
          '在公交车站违法停车，影响公交车进出站',
          '机动车非紧急情况下在高速公路应急车道上停车',
          '进入导向车道，不按指示方向行驶',
          '遇到前方车辆拥堵排队等候时，<br>随意变更车道行驶、加塞插队的'], // actionSheet的子目录
        model_sure_del: false, // 底部删除图标显示状态
        nameShow: false, // 底部删除图标显示状态
        phoneShow: false, // 底部删除图标显示状态
        idShow: false, // 底部删除图标显示状态
        behaveShow: false, // 底部删除图标显示状态
        reportName: '',
        reportPhone: '',
        reportId: '',
        reportBehave: ''
      }
    },
    methods: {
      sure_del (item, index) {
        let vm = this
        vm.reportBehave = item
        vm.model_sure_del = false
      },
      start_search (item, index) {
        let vm = this
        if (vm.checkValid()) {
          let IllegallyStatus = JSON.parse(sessionStorage.getItem('currentIllegallyStatus'))
          for (let i = 0; i < IllegallyStatus.length; i++) {
            if (IllegallyStatus[i].id === vm.vedioid) {
              IllegallyStatus[i].status = false
            }
          }
          sessionStorage.setItem('currentIllegallyStatus', JSON.stringify(IllegallyStatus))
          vm.$router.replace({name: 'IllegallyDetail'})
        }
      },
      // 检查验证数据是否为空
      checkValid () {
        let vm = this
        if (vm.reportName === '') {
          vm.nameShow = true
          return false
        }
        if (!mobile.test(vm.reportPhone)) {
          vm.phoneShow = true
          return false
        }
        if (!idCard.test(vm.reportId)) {
          vm.idShow = true
          return false
        }
        if (vm.reportBehave === '') {
          vm.behaveShow = true
          return false
        }
        return true
      }
    },
    watch: {
      reportName (val) {
        if (val !== '') {
          this.nameShow = false
        }
      },
      reportPhone (val) {
        if (mobile.test(val)) {
          this.phoneShow = false
        }
      },
      reportId (val) {
        if (idCard.test(val)) {
          this.idShow = false
        }
      },
      reportBehave (val) {
        if (val !== '') {
          this.behaveShow = false
        }
      }
    },
    created () {
      this.vedioid = this.$route.params.id
    }
  }
</script>
