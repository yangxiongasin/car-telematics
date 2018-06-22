<template>
    <div class="freeInstall">
      <div class="label_input ">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">输入用户信息</span>
        </div>
        <div class="y_input flex_cen_bet border_bm_18">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="姓名" v-model="customerName">
          </div>
          <i class="weui-icon-error icon" v-show="nameShow"></i>
        </div>

        <div class="y_input flex_cen_bet border_bm_18">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" maxlength="11" type="tel" placeholder="手机号码（输入11位，接收安装短信）" @blur="customerMobileBlur" v-model="customerMobile">
          </div>
          <i class="weui-icon-error icon" v-show="phone_numShow"></i>
        </div>

        <div class="y_input flex_cen_bet border_bm_18" @click="select_brand">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
              <input class="weui-input" placeholder="车系品牌" readonly v-model="carBrand">
          </div>
          <i class="weui-icon-error icon" v-show="PaulbrandShow"></i>
          <div class="y_model_div"></div>
        </div>

        <div class="y_input flex_cen_bet border_bm_18" @click="carmodel_sel = true">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="选择车型" readonly v-model="carModel_sel">
          </div>
          <i class="weui-icon-error icon" v-show="carModelsShow"></i>
        </div>

        <div class="y_input flex_cen_bet border_bm_18" :class="{disabled_ipt: car_other_dis}">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="其他车型" :disabled="car_other_dis" v-model="carModel_other">
          </div>
          <i class="weui-icon-error icon" v-show="carModelsShow"></i>
        </div>

        <div class="y_input flex_cen_bet border_bm_18">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="车型年份(YYYY)" v-model="carYear">
          </div>
          <i class="weui-icon-error icon" v-show="carYearShow"></i>
        </div>
      </div>

      <div class="label_input ">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">输入地址信息</span>
        </div>
        <div class="y_input flex_cen_bet border_bm_18" @click="address_Juti = true">
          <div class="flex_at_cen" >
            <div class="flex_center star">*</div>
            <input class="weui-input" readonly placeholder="省份-城市-区域" v-model="addressJuti" >
          </div>
          <i class="weui-icon-error icon" v-show="addressJutiShow"></i>
          <div class="y_model_div"></div>
        </div>

        <div class="y_input flex_cen_bet border_bm_18">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="详细地址（不用填省市区）" v-model="customerAddr">
          </div>
          <i class="weui-icon-error icon" v-show="addressShow"></i>
        </div>

        <div class="y_input flex_cen_bet border_bm_18" @click="select_shop">
          <div class="flex_at_cen">
            <div class="flex_center star">*</div>
            <input class="weui-input" placeholder="选择门店" readonly v-model="dotName">
          </div>
          <i class="weui-icon-error icon" v-show="SelectstoresShow"></i>
          <div class="y_model_div"></div>
        </div>
      </div>

      <div class="label_input ">
        <div class="y_label flex_at_cen">
          <span class="font_7B_75">安装选择（必选）</span>
        </div>

        <m-cells v-if="!installSel_show">
          <label class="weui-cell weui-check__label" for="standard">
            <div class="weui-cell__bd flex_col">
              <span class="font_2D_88_156">1. 标准安装服务</span>
              <span class="font_7B_88">注：没有倒车摄像头只能选择此项</span>
            </div>
            <div class="weui-cell__ft">
              <input type="radio" class="weui-check" name="standardInstall" v-model="installOption" id="standard" value="001">
              <span class="weui-icon-checked"></span>
            </div>
          </label>

          <label class="weui-cell weui-check__label" for="standard_up">
            <div class="weui-cell__bd flex_col">
              <span class="font_2D_88_156">2. 标准安装服务 + 升级服务（倒车摄像头）</span>
              <span class="font_7B_88">注：有倒车摄像头，并选择安装至车辆后挡玻璃或车牌处，请选择此项。</span>
            </div>
            <div class="weui-cell__ft">
              <input type="radio" name="standardInstall" class="weui-check" id="standard_up" value="002" v-model="installOption">
              <span class="weui-icon-checked"></span>
            </div>
          </label>

          <div class="y_warning flex_at_cen">
            <i class="weui-icon-error"></i>
            <span class="font_FF_75">如您确认持有倒车摄像头，并要安装，请务必选择第2项。</span>
          </div>
        </m-cells>

        <m-cells v-if="installSel_show">
          <label class="weui-cell weui-check__label" for="majors">
            <div class="weui-cell__bd flex_col">
              <span class="font_2D_88_156">1. 专业安装服务</span>
              <span class="font_7B_88">注：没有胎压检测仪请选择此项</span>
            </div>
            <div class="weui-cell__ft">
              <input type="radio" class="weui-check" name="majorsInstall" v-model="installOption" id="majors" value="001">
              <span class="weui-icon-checked"></span>
            </div>
          </label>

          <label class="weui-cell weui-check__label" for="majors_up">
            <div class="weui-cell__bd flex_col">
              <span class="font_2D_88_156">2. 专业安装服务 + 升级服务（胎压监测）</span>
              <span class="font_7B_88">注：有胎压监测仪并选择进行安装请选择此项</span>
            </div>
            <div class="weui-cell__ft">
              <input type="radio" name="majorsInstall" class="weui-check" id="majors_up" value="002" v-model="installOption">
              <span class="weui-icon-checked"></span>
            </div>
          </label>

          <div class="y_warning flex_at_cen">
            <i class="weui-icon-error"></i>
            <span class="font_FF_75">如您确认持有胎压监测仪，并要安装，请务必选择第2项。</span>
          </div>
        </m-cells>
      </div>

      <div class="btn_submit flex_center" v-show="submitShow">
        <button class="weui-btn weui-btn_primary weui-btn_block" @click="submitFreeInt">提交</button>
      </div>

      <!-- 车型选择 -->
      <m-picker v-model="carmodel_sel" :items="carmodel_Slots"
                @cancel="cancel"
                @confirm="carmodel_confirm"></m-picker>

      <!-- 省市区选择 -->
      <m-picker v-model="address_Juti" :items="addressSlots"
                @change="onAddressChange"
                @cancel="cancel"
                @confirm="confirm"></m-picker>

      <div class="sel_shop border_bm_18" v-show="sel_shop_pop">
        <div v-for="item in sel_shopData">
          <div class="y_label flex_at_cen">
            <span class="font_7B_75">门店编号：{{item.dotCode}}</span>
          </div>
          <div class="sel_shop_content ">
            <div class="flex_wrap_end">
              <div class="font_2D_88_156">{{item.dotName}}</div>
              <button class="weui-btn weui-btn_default weui-btn_mini" @click="sel_shop_sure(item)">选择门店</button>
            </div>
            <div class="font_7B_88">{{item.dotAddr}}</div>
          </div>
        </div>
      </div>

      <div class="sel_shop border_bm_18" v-show="sel_brand_pop">
        <m-index-list :list="alphabet" :initials="initials" @on-check="checkBrand"></m-index-list>
      </div>
    </div>
</template>

<script>
  import wxMinxin from '../../../mixin/wx-api'
  const mobile = /^1[3|4|5|6|7|8]\d{9}$/
  const year = /[2]\d{3}/
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        imei: '', // 扫描设备之后返回的IMEI号码
        customerName: '', // 姓名 1
        customerMobile: '', // 手机号码 1
        province: '', // 省 1
        city: '', // 市 1
        district: '', // 区县 1
        customerAddr: '', // 详细地址 1
        carBrand: '', // 车系品牌 1
        carBrandId: '', // 车系品牌Id 1
        carModel: '', // 车型
        carModel_sel: '', // 车型
        carModel_sel_data: [
          {key: '', value: ''}
        ], // 选择车型
        carModel_other: '', // 其他车型
        carYear: '', // 车型年份
        dotCode: '', // 门店编号 1
        dotName: '', // 门店名称 1
        installType: 'normal', // 安装选择normal,professional
        manufacturer: '', // 厂商ID
        installOption: '001',
        addressJuti: '', // 省份
        // 警告表示是否显示
        nameShow: false, // 姓名
        phone_numShow: false, // 手机号码
        PaulbrandShow: false, // 车系品牌
        carModelsShow: false, // 车型
        carYearShow: false, // 车型年份
        addressJutiShow: false, // 省份
        addressShow: false, // 详细地址
        SelectstoresShow: false, // 选择门店
        installSelShow: false, // 安装选择
        installSel_show: false,
        car_other_dis: true, // 其他车型禁用状态

        address_Juti: false,
        carmodel_sel: false,
        sel_shop_pop: false, // 选择门店页面

        sel_shopData: [],

        provincesData: '', // 省份数据存放处
        provincesCode: '', // 省份Code
        cityDatas: '', // 市数据存放处
        cityCode: '', // 省份Code
        districtDatas: '', // 区县数据存放处
        districtCode: '', // 省份Code

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
        ],
        carmodel_Slots: [{
          values: [
            {value: '请选择车系品牌'}
          ],
          defaultIndex: -1,
          valueKey: 'value' // areaName作key的字段名
        }],
        sel_brand_pop: false,
        initials: [],
        alphabet: [],
        submitShow: true
      }
    },
    methods: {
      customerMobileBlur () {
        let mobile = /^1[3|4|5|7|8]\d{9}$/
        if (this.customerMobile.length < 11) {
          this.phone_numShow = true
        } else {
          if (mobile.test(this.customerMobile)) {
            this.phone_numShow = false
          } else {
            this.phone_numShow = true
          }
        }
      },
      // 根据路由传过来的IMEI，查询设备新旧情况，并且将设备的安装类型查询
      init () {
        const vm = this
        let info = vm.$store.getters.getInstallInfo
        if (info.imei !== '') {
          vm.imei = info.imei
        }
        if (info.installType !== '') {
          vm.installType = info.installType
          if (vm.installType === 'normal') {
            vm.installSel_show = false
          } else {
            vm.installSel_show = true
          }
        }
        if (info.manufacturer !== '') {
          this.manufacturer = info.manufacturer
        }
        vm.$http.post(vm.$service.service.getAreas, {
          operType: 1
        }).then(data => {
          vm.provincesData = JSON.parse(data.data)
          let arr = []
          for (let i = 0; i < vm.provincesData.length; i++) {
            arr.push(vm.provincesData[i].areaName)
          }
          vm.addressSlots[0].values = arr
          vm.provincesCode = vm.provincesData[0].areaCode
          vm.initCity(vm.provincesCode)
        })
      },
      // 初始化城市
      initCity (val) {
        let vm = this
        vm.$http.post(vm.$service.service.getAreas, {
          operType: 2,
          parentAreaCode: val
        }).then(data => {
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
          if (data !== null) {
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
          }
        })
      },
      // 选择所选车型之后
      carmodel_confirm (values) {
        let vm = this
        console.log(values)
        let val = values[0].value
        let key = values[0].key
        // 选择车型之后，其他车型默认状态设为禁止，如果选择的值不是'请选择车系品牌'，那么将val赋值给选择车型。如果选择的车型是‘其他车型’
        // 那么将其他车型禁止状态解除，否则将其他车型的输入框值置为空
        vm.car_other_dis = true
        if (val !== '请选择车系品牌') {
          if (val === '其他车型') {
            vm.car_other_dis = false
          } else {
            vm.carModel_other = ''
          }
          vm.carModel_sel = val
          vm.carModel = key
        }
      },
      // 选择省市县点击缺点之后，将选择的值赋值
      confirm (values) {
        values[1] = this.addressValue[1]
        values[2] = this.addressValue[2]
        this.province = this.provincesCode// 省
        this.city = this.cityCode// 市
        this.district = this.districtCode// 区县
        this.addressJuti = values.join('-')
        this.dotName = ''
      },
      // 检查验证数据是否为空
      checkValid () {
        let vm = this
        if (vm.customerName === '') {
          vm.nameShow = true
          return false
        }
        if (!mobile.test(vm.customerMobile)) {
          vm.phone_numShow = true
          return false
        }
        if (!year.test(vm.carYear)) {
          vm.carYearShow = true
          return false
        }
        if (vm.carBrandId === '') {
          vm.PaulbrandShow = true
          return false
        }
        if (vm.carModel === '') {
          vm.carModelsShow = true
          return false
        }
        if (vm.addressJuti === '') {
          vm.addressJutiShow = true
          return false
        }
        if (vm.dotName === '') {
          vm.SelectstoresShow = true
          return false
        }
        if (vm.customerAddr === '') {
          vm.addressShow = true
          return false
        }
        return true
      },
      // 如果验证函数返回true，那么执行下面内容
      submitFreeInt () {
        let vm = this

        if (vm.checkValid() === true) {
          vm.$http.post(vm.$service.service.install, {
            imei: vm.imei, // 设备号
            customerName: vm.customerName, // 车主姓名
            customerMobile: vm.customerMobile, // 车主手机
            province: vm.province, // 省份
            city: vm.city, // 市
            region: vm.district, // 区域
            customerAddr: vm.customerAddr, // 车主地址
            carBrand: vm.carBrandId, // 车系品牌
            carModel: vm.carModel, // 车型
            oteherModel: vm.carModel_other, // 车型
            carYear: vm.carYear, // 车型年份
            dotCode: vm.dotCode, // 门店编号
            dotName: vm.dotName, // 门店名称
            installType: vm.installType, // 安装类型
            installOption: vm.installOption // 安装类型
          }).then(data => {
            if (data !== null) {
              this.$router.push({name: 'InstallationServices'})
            }
          })
        }
      },
      // 点击选择门店输入框，如果地址的信息为空，那么弹出提醒框，否则进入选择页面
      select_shop () {
        let vm = this
        if (vm.addressJuti === '') {
          vm.$Toast({
            message: `<div class="y_IMEI">
                      请选择省市区，再选择门店！
                    </div>`,
            iconClass: 'weui-icon-error',
            duration: 800
          })
        } else {
          vm.$http.post(this.$service.service.getStore, {
            areaCode: vm.districtCode,
            manufacturer: vm.manufacturer,
            installType: vm.installType
          }).then(data => {
            if (data.data !== null) {
              vm.sel_shopData = data.data
              if (vm.sel_shopData.length === 0) {
                vm.$Toast({
                  message: `<div class="y_IMEI">
                      该区域没有门店
                    </div>`,
                  iconClass: 'weui-icon-cancel',
                  duration: 800
                })
              } else {
                document.documentElement.scrollTop = document.body.scrollTop = 0
                vm.sel_shop_pop = true
                vm.submitShow = false
                document.title = '选择门店'
              }
            }
          })
        }
      },
      // 车系品牌选择
      select_brand () {
        let vm = this
        let brandEnlish = []
        let brandPinyin = []
        let brandFirst = []
        // 获取brand数据， bian
        vm.$http.post(vm.$service.service.getBrands, {}).then(data => {
          for (let i = 0; i < data.data.length; i++) {
            brandPinyin.push(data.data[i].pinyin)
            brandEnlish.push(data.data[i].pinyin[0])
          }
          for (let i = 0; i < brandEnlish.length; i++) {
            if (brandFirst.indexOf(brandEnlish[i]) === -1) {
              brandFirst.push(brandEnlish[i])
            }
          }
          this.initials = []
          this.alphabet = []
          brandFirst = brandFirst.sort()
          brandFirst.forEach(initial => {
            let cells = []
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].pinyin[0] === initial) {
                let brandId = data.data[i].brandId
                let brandName = data.data[i].brandName
                cells.push({brandId, brandName})
              }
            }
            initial = initial.toUpperCase()
            this.initials.push(initial.toUpperCase())
            this.alphabet.push({
              initial,
              cells
            })
          })
          vm.sel_brand_pop = true
          document.title = '选择品牌'
        })
      },
      // 选择一个车系品牌， 将'车系品牌'弹窗关闭，并将选中的车系品牌ID作为入参，调用'getBrands'接口，查看该车系下面车型
      checkBrand (val) {
        let vm = this
        vm.sel_brand_pop = false
        vm.carBrand = val.brandName
        vm.carBrandId = val.brandId
        document.title = '免费安装'
        // 将'选择车型'和'其他车型'值置为空，并将其他车型输入框禁用
        vm.carModel_sel = ''
        vm.carModel_other = ''
        vm.car_other_dis = true
        vm.$http.post(vm.$service.service.getBrands, {
//          brandName: val.brandName,
          parentId: val.brandId
        }).then(data => {
          if (data && data.data) {
            let date = data.data
            vm.carmodel_Slots[0].values = []
            for (let i = 0; i < date.length; i++) {
              vm.carmodel_Slots[0].values.push({value: date[i].brandName, key: date[i].brandId})
            }
          }
        })
      },
      // 点击了选择门店，将选择门店的属性传过去
      sel_shop_sure (item) {
        let vm = this
        vm.dotName = item.dotName
        vm.dotCode = item.dotCode
        vm.sel_shop_pop = false
        vm.submitShow = true
        document.title = '免费安装'
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
      customerName (val) {
        if (val !== '') {
          this.nameShow = false
        }
      },
      customerMobile (val) {
        if (mobile.test(val)) {
          this.phone_numShow = false
        }
      },
      carBrand (val) {
        if (val !== '') {
          this.PaulbrandShow = false
        }
      },
      carModel (val) {
        if (val !== '') {
          this.carModelsShow = false
        }
      },
      addressJuti (val) {
        if (val !== '') {
          this.addressJutiShow = false
        }
      },
      customerAddr (val) {
        if (val !== '') {
          this.addressShow = false
        }
      },
      dotName (val) {
        if (val !== '') {
          this.SelectstoresShow = false
        }
      },
      carYear (val) {
        if (year.test(val)) {
          this.carYearShow = false
        }
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
