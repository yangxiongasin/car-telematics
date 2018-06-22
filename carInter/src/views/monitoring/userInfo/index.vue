<template>
  <div class="userInfo">
    <div class="flex_cen_bet y_cell userInfo_cont">
      <div class="weui-flex">
        <div class="head_img head_img_4 flex_center">
          <img v-lazy="userInfo.headPortrait">
        </div>
        <div class="message">
          <div class="first_name">{{userInfo.nickName}}</div>
          <div class="flex_at_cen">
            <div class="sex_male flex_center"><i class="flex_center" :class="sexIcon"></i></div>
            <span class="second_name" v-text="position"></span>
          </div>
        </div>
      </div>
      <div class="weui-flex status" >
      </div>
    </div>
    <div class="y_label font_7B_75 flex_at_cen">
        绑定手机
    </div>
    <div class="flex_cen_bet y_cell">
      <div class="font_2D_88">{{userInfo.userMobile}}</div>
      <div class="font_7B_15" @click="changePhoneNum">
        <span class="font_7B_15">{{userInfo.userMobile ? '更换' : '设置'}}</span>
        <i class="weui-icon-ai-chevron-right"></i>
      </div>
    </div>

    <div class="y_label flex_at_cen">
      <span class="font_7B_75 ">我的设备</span>
    </div>

    <div v-if="Singlepeople" v-show="hasEqui">
      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">设备昵称</div>
        <div @click="ChangeDeviceNickname" class="font_7B_15">
          <span class="font_7B_15">{{defaultDevice.nickName}}</span>
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>

      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">IMEI</div>
        <div class="font_7B_15">
          <span class="font_7B_15">{{defaultDevice.imei}}</span>
        </div>
      </div>

      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">状态</div>
        <div class="font_7B_15">
          <span class="font_7B_15">{{defaultDevice.online?'在线':'离线'}}</span>
        </div>
      </div>

      <div class="y_search_btn">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="isShowActionSheet=true">
          <span>解除绑定</span>
        </button>
      </div>
    </div>

    <div class="noEqui flex_center font_7B_88_156 border_bm_18" v-show="!hasEqui">
      没有设备
    </div>

    <div v-if="!Singlepeople && hasEqui">
      <div class="flex_cen_bet y_cell border_bm_18">
        <div class="font_2D_88">当前设备</div>
        <div class="font_7B_15" @click="currentEquipment">
          <span class="font_7B_15">{{defaultDevice.nickName}}</span>
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>

      <div class="flex_cen_bet y_cell border_bm_18" v-for="item in allBindEquList">
        <div class="font_2D_88">{{item.nickName}}</div>
        <div class="font_7B_15"  @click="myEquipment(item)">
          <span class="font_7B_15">设置</span>
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>
    </div>

    <div class="flex_center font_7B_88 text_cen mr_top_125">
      绑定新设备：<br>
      打开后视镜扫描【关于】中的二维码
    </div>

    <div class="y_search_btn mr_bm_5">
      <button class="weui-btn weui-btn_default weui-btn_block" @click="openScan">
        <span>绑定新设备</span>
      </button>
    </div>
    <div class="y_search_btn mr_top_0">
      <button class="weui-btn weui-btn_default weui-btn_block" @click="lookBinding($service.userInfo.equBind)">
        <span>查看绑定流程</span>
      </button>
    </div>

    <m-action-sheet v-model="isShowActionSheet" titleText="解除绑定此设备"
                    :menus="menus" @menu-item-click="handleMenuClick"></m-action-sheet>
  </div>
</template>

<script>
  import wxMinxin from '../mixin/wx-api'
  export default {
    mixins: [wxMinxin],
    data: function () {  // store data
      return {
        Singlepeople: false, // 单个设备和多个设备切换
        hasEqui: true,
        isShowActionSheet: false,
        menus: ['<span style="color: #ff5f5f;">解绑设备</span>']
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.getUserInfo
      },
      allBindEquList () {
        return this.$store.getters.getAllBindEquList
      },
      defaultDevice () {
        return this.$store.getters.getDefaultDevice
      },
      // 显示性别图标
      sexIcon () {
        let sex = this.$store.getters.getUserInfo.sex
        if (sex) {
          sex = parseInt(sex)
        }
        if (sex === 1) {
          return 'weui-icon-ai-gender-male'
        } else if (sex === 2) {
          return 'weui-icon-ai-gender-female'
        } else {
          return 'weui-icon-ai-gender-male-female'
        }
      },
      position () {
        let province = this.$store.getters.getUserInfo.province
        let city = this.$store.getters.getUserInfo.city
        if (province && city) {
          return `${province} , ${city}`
        } else if (province) {
          return province
        } else if (city) {
          return city
        } else {
          return '无法获取地址'
        }
      }
    },
    methods: { // methods
      init () {
        let vm = this
        vm.$store.dispatch('getBindEquList', true)
      },
      checkDevice () {
        const vm = this
        // 判断设备列表数是否大于1，如果大于1则显示多数设备的页面，否则显示单个设备
        if (vm.allBindEquList === null) {
          vm.Singlepeople = true
          vm.hasEqui = false
        } else if (vm.allBindEquList.length > 1) {
          // 当设备数大于1的时候，选出默认的设备，将设备名保存到defaultEqu
          vm.Singlepeople = false
          vm.hasEqui = true
        } else {
          vm.Singlepeople = true
          vm.hasEqui = true
        }
      },
      // 改变设备昵称
      ChangeDeviceNickname () {
        this.$router.push({name: 'ChangeDeviceNickname', params: {mess: this.defaultDevice}})
      },
      // 改变绑定手机号码
      changePhoneNum () {
        this.$router.push({name: 'changePhoneNum', params: {num: this.userInfo.userMobile}})
      },
      openScan () {
        let vm = this
        vm.scanCode()
      },
      myEquipment (item) {
        this.$store.commit('setSelectEqui', item)
        this.$router.push({name: 'myEquipment', params: {obj: item}})
      },
      currentEquipment () {
        this.$router.push({name: 'currentEquipment', query: {hasTab: true}})
      },
      // 确定取消绑定
      handleMenuClick (item, index) {
        let vm = this
        vm.$http.post(vm.$service.userInfo.unBindEqu, {
          imei: vm.defaultDevice.imei
        }).then(data => {
          // 刷新设备信息
          vm.$store.dispatch('getBindEquList')
          vm.$router.push('/views/monitoring/monitor')
        })
      },
      // 查看绑定流程
      lookBinding (item) {
        let vm = this
        this.$http.post(item, null).then(data => {
          let msg = data.data
          vm.$router.push({name: 'userDetail', params: {id: msg}})
        })
      }
    },
    watch: {
      allBindEquList () {
        this.checkDevice()
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
      this.init()
    }
  }
</script>
