<template>
    <div class="serviceOutlets">
      <div class="y_label flex_at_cen">
        <span class="font_7B_75">输入地址信息</span>
      </div>
      <div class="y_input flex_cen_bet border_bm_18" @click="address_Juti = true">
        <div class="flex_at_cen" >
          <div class="flex_center star">*</div>
          <input class="weui-input" type="tel" placeholder="省份-城市-区域" disabled v-model="addressJuti" >
        </div>
        <i class="weui-icon-error icon" v-show="addressJutiShow"></i>
        <div class="y_model_div"></div>
      </div>

      <div class="y_input flex_cen_bet border_bm_18">
        <div class="flex_at_cen">
          <div class="flex_center star">&nbsp;</div>
          <input class="weui-input" placeholder="车主地址（不用填省市区）" v-model="address">
        </div>
      </div>

      <div class="y_search_btn">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="start_search">
          <i class="weui-icon-search"></i>
          <span>查询</span>
        </button>
      </div>

      <m-picker v-model="address_Juti" :items="addressSlots"
                @change="onAddressChange"
                @cancel="cancel"
                @confirm="confirm"></m-picker>

    </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        provincesData: '', // 省份数据存放处
        provincesCode: '', // 省份Code
        cityDatas: '', // 市数据存放处
        cityCode: '', // 省份Code
        districtDatas: '', // 区县数据存放处
        districtCode: '', // 省份Code
        lat: 0,
        lon: 0,
        addressJuti: '',
        address: '',
        addressJutiShow: false,
        address_Juti: false,
        addressValue: ['', '', ''], // 省市区的值
        addressSlots: [
          {
            values: [],
            defaultIndex: 0
          },
          {
            values: [],
            defaultIndex: 0
          },
          {
            values: [],
            defaultIndex: 0
          }
        ]
      }
    },
    methods: {
      // 初始化省份或者直辖市
      init () {
        let vm = this
        vm.$http.post(vm.$service.service.getAreas, {
          operType: 1
        }).then(data => {
          if (!data || !data.data) {
            vm.Toast.error('获取省分数据不成功')
            return
          }
          vm.provincesData = JSON.parse(data.data)
          let arr = []
          for (let i = 0; i < vm.provincesData.length; i++) {
            arr.push(vm.provincesData[i].areaName)
          }
          vm.addressSlots[0].values = arr
          vm.provincesCode = vm.provincesData[0].areaCode
          vm.initCity(vm.provincesData[0].areaCode)
        })
      },
      // 初始化城市
      initCity (val) {
        let vm = this
        vm.$http.post(vm.$service.service.getAreas, {
          operType: 2,
          parentAreaCode: val
        }).then(data => {
          if (!data || !data.data) {
            vm.Toast.error('获取地市数据不成功')
            return
          }
          vm.cityDatas = JSON.parse(data.data)
          let arr = []
          for (let i = 0; i < vm.cityDatas.length; i++) {
            arr.push(vm.cityDatas[i].areaName)
          }
          vm.addressSlots[1].values = arr
          vm.cityCode = vm.cityDatas[0].areaCode
          vm.addressValue[1] = vm.cityDatas[0].areaName
          vm.initDist(vm.cityCode)
        })
      },
      // 初始化区县
      initDist (val) {
        let vm = this
        vm.$http.post(vm.$service.service.getAreas, {
          operType: 3,
          parentAreaCode: val
        }).then(data => {
          console.log(data.data)
          if (data.data !== null) {
            vm.districtDatas = JSON.parse(data.data)
            let arr = []
            for (let i = 0; i < vm.districtDatas.length; i++) {
              arr.push(vm.districtDatas[i].areaName)
            }
            vm.addressSlots[2].values = arr
            vm.districtCode = vm.districtDatas[0].areaCode
            vm.addressValue[2] = vm.districtDatas[0].areaName
          } else {
            vm.addressSlots[2].values = []
            vm.districtCode = val
            vm.addressValue[2] = vm.addressValue[1]
          }
        })
      },
      confirm (values) {
        values[1] = this.addressValue[1]
        values[2] = this.addressValue[2]
        this.addressJuti = values.join('-')
        this.address = ''
      },
      // 点击下拉弹出框中的取消
      cancel (values) {
        console.log('点击了取消')
      },
      // 改变下拉弹出框中的值时执行函数
      onAddressChange (value, index) {
        let vm = this
        if (value) {
          switch (index) {
            case 0: for (let i = 0; i < vm.provincesData.length; i++) {
              if (value === vm.provincesData[i].areaName) {
                vm.provincesCode = vm.provincesData[i].areaCode
              }
            }; break
            case 1: for (let i = 0; i < vm.cityDatas.length; i++) {
              if (value === vm.cityDatas[i].areaName) {
                vm.cityCode = vm.cityDatas[i].areaCode
                vm.addressValue[1] = vm.cityDatas[i].areaName
              }
            }; break
            case 2: for (let i = 0; i < vm.districtDatas.length; i++) {
              if (value === vm.districtDatas[i].areaName) {
                vm.districtCode = vm.districtDatas[i].areaCode
                vm.addressValue[2] = vm.districtDatas[i].areaName
              }
            }; break
          }
        }
      },
      start_search () {
        let vm = this
        if (vm.addressJuti === '') {
          vm.addressJutiShow = true
        } else {
          let data = {lat: vm.lat, lng: vm.lon, areaCode: vm.districtCode, currentPage: '1', pageSize: '5'}
          this.$store.commit('setParamsDate', data)
          vm.$router.push({
            name: 'outletOnlineStore'
          })
        }
      },
      getLocation () {
        const vm = this
        vm.getWXLocation((longitude, latitude) => {
          vm.lat = latitude
          vm.lon = longitude
        })
      }
    },
    watch: {
      provincesCode (val, oldval) {
        let vm = this
        vm.initCity(val)
      },
      cityCode (val) {
        let vm = this
        vm.initDist(val)
      },
      addressJuti (val) {
        if (val !== '') {
          this.addressJutiShow = false
        }
      },
      address (val) {
        if (val !== '') {
          this.addressShow = false
        }
      }
    },
    beforeCreate () {
      const vm = this
      vm.$on('handleWXReady', () => {
        vm.getLocation()
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.init()
    }
  }
</script>
