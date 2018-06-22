<template>
    <div class="installServices">
      <div class="y_label flex_at_cen">
        <span class="font_7B_75">设备列表</span>
      </div>
      <div class="views-wrap" v-show="data_load">
        <i class="pageIndexLoading"></i>
      </div>
      <div class="noEqui flex_center" v-show="!noEquiShow">
        <span class="font_7B_88_156">没有设备</span>
      </div>
      <div class="flex_cen_bet border_bm_18 y_cell" v-for="item in list"  v-show="noEquiShow">
        <div class="weui-flex">
          <div class="head_img flex_center">
            <i class="weui-icon-ai-rearview-mirror"></i>
          </div>
          <div class="message">
            <div class="first_name">{{item.nickName}}</div>
            <div class="second_name">IMEI: {{item.imei}}</div>
          </div>
        </div>
        <div class="weui-flex status" @click="detailClick(item)">
          <span class="status" ref="statusValue">
            {{item.installStatus}}
          </span>
          <i class="weui-icon-ai-chevron-right"></i>
        </div>
      </div>

      <div class="y_search_btn">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="start_search">
          <i class="weui-icon-ai-barcode-scan"></i>
          <span>扫描IMEI安装新设备</span>
        </button>
      </div>

      <p style="text-align: right">
        <span @click="IMEIWhat" class="mr_top_125 font_2D_88 color_918_639">
          IMEI ？
        </span>
      </p>
      <!--<router-link :to="{name: 'freeInstall'}">jinqu</router-link>-->
    </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        noEquiShow: true, // 如果没有设备，那么就不显示列表
        data_load: true, // 进来的时候加载
        list: []
      }
    },
    methods: { // methods1
      init () {
        let vm = this
        // 调用‘installList’接口, 将值保存到allData，如果allData不存在或者length为0，那么显示没有设备
        // 否则通过遍历allData将status值对应变化然后将数据赋给list
        this.$http.post(this.$service.service.installList, {}).then(data => {
          let allData = data.data
          if (!allData || allData.length === 0) {
            vm.noEquiShow = false
          } else {
            vm.noEquiShow = true
            for (let i = 0; i < allData.length; i++) {
              switch (allData[i].installStatus) {
                case '0' : allData[i].installStatus = '订单已接收'; break
                case '1' : allData[i].installStatus = '订单已派单'; break
                case '2' : allData[i].installStatus = '订单已完成'; break
              }
            }
          }
          vm.list = allData
          vm.data_load = false
        })
      },

      detailClick (item) {
        let vm = this
        let status = item.installStatus
        if (status === '订单已接收') {
          vm.$Dialog({
            message: `<div class="y_IMEI">
                        <div class="IMEI_title">
                            该设备已提交订单，请耐心等待！
                        </div>
                        <div>
                          如客服无响应，<br>
                          可在<span style="color:red;">2</span>小时后重新扫描IMEI预约
                        </div>
                      </div>`,
            iconClass: 'weui-icon-ai-alarm color_918'
          })
        } else if (status === '未安装') {
          let installInfo = {
            imei: item.imei,
            installType: item.installType,
            manufacturer: item.manufacturer
          }
          this.$store.commit('setInstallInfo', installInfo)
          vm.$router.push({name: 'freeInstall', params: {imei: item.imei}})
        } else {
          vm.$router.push({name: 'installServiceDetails', params: {message: item.imei}})
        }
      },

      // 点击'扫描IMEI并且安装新设备'，扫描成功则跳转到信息填写压面
      start_search () {
        let vm = this
        vm.scanQRCode()
      },
      scanQRCode () {
        let vm = this
        vm.scanBarCode((imei) => {
          vm.$http.post(vm.$service.getEquModelRoute, {
            imei: imei
          }).then(data => {
            if (data && data.data) {
              let status = Number(data.data.installStatus)
              if (status === 0) {
                vm.$Dialog({
                  message: `<div class="y_IMEI">
                        <div class="IMEI_title">
                            该设备已提交订单，请耐心等待！
                        </div>
                        <div>
                          如客服无响应，<br>
                          可在<span style="color:red;">2</span>小时后重新扫描IMEI预约
                        </div>
                      </div>`,
                  iconClass: 'weui-icon-ai-alarm color_918'
                })
              } else if (status === 1 || status === 2) {
                vm.$router.push({name: 'installServiceDetails', params: {message: imei}})
              } else {
                let installInfo = {
                  imei: imei,
                  installType: data.data.installType,
                  manufacturer: data.data.manufacturer
                }
                this.$store.commit('setInstallInfo', installInfo)
                vm.$router.push({name: 'freeInstall'})
              }
            }
          })
        })
      },
      // 点击'IMEI？'处理函数
      IMEIWhat () {
        this.$Dialog({
          message: `<div class="y_IMEI">
                      <div class="IMEI_title">
                          IMEI号位于包装盒侧边或设备背部
                      </div>
                      <div class="IMEI_img flex_at_cen">
                        <i class="weui-icon-ai-chinamobile"></i>
                        <div class="flex_col IMEI_type">
                          <div>4G智能后视镜</div>
                          <div>型号：X2 / X3</div>
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
    mounted () {
      this.init()
    }
  }
</script>
