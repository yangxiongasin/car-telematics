<template>
  <div style="padding: 10px 5px;">
    <m-button size="large" @click.native="picker1 = true">单列选择器</m-button>
    <m-button size="large" @click.native="picker2 = true">多列选择器</m-button>
    <m-button size="large" @click.native="picker3 = true">省分选择器</m-button>
    <m-picker v-model="picker1" :items="ticketObjSlots" @change="ticketChg"
              @cancel="cancel"
              @confirm="confirm"></m-picker>
    <m-picker v-model="picker2" :items="daySlots" @confirm="confirm"></m-picker>
    <p>地址: {{addressValue}}</p>
    <m-picker v-model="picker3" :items="addressSlots"
              @change="onAddressChange"
              @cancel="cancel"
              @confirm="confirm"></m-picker>
  </div>
</template>

<script>
  import chinaAreaData from 'china-area-data'
  let provinces = Object.values(chinaAreaData[86])
  // 获取某一省下的市
  function getCities (province) {
    let provinceCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }

    return Object.values(chinaAreaData[provinceCode])
  }

  // 获取某一市下的区/县
  function getAreas (province, city) {
    let provinceCode, cityCode
    for (let i in chinaAreaData[86]) {
      if (province === chinaAreaData[86][i]) {
        provinceCode = i
        break
      }
    }

    for (let i in chinaAreaData[provinceCode]) {
      if (city === chinaAreaData[provinceCode][i]) {
        cityCode = i
        break
      }
    }

    if (chinaAreaData[cityCode]) {
      return Object.values(chinaAreaData[cityCode])
    } else {
      // 只有两级的情况
      return []
    }
  }
  export default {
    data: function () {  // store data
      return {
        picker1: false,
        picker2: false,
        picker3: false,
        ticketValue: '',
        ticketSlots: [
          {
            values: [
              '汽车票',
              '飞机票',
              '火车票',
              '轮船票',
              '其它'
            ],
            defaultIndex: 0,
            valueKey: '' // value作key的字段名
          }
        ],
        ticketObjSlots: [{
          values: [
            {key: 0, value: '汽车票'},
            {key: 1, value: '飞机票(disabled)', disabled: true},
            {key: 2, value: '火车票'},
            {key: 3, value: '轮船票'},
            {key: 4, value: '其它'}
          ],
          defaultIndex: 0,
          valueKey: 'value' // value作key的字段名
        }],
        daySlots: [
          {
            values: [
              '星期一',
              '星期二',
              '星期三',
              '星期四',
              '星期五'
            ],
            defaultIndex: 0
          },
          {
            values: [
              '上午',
              '下午'
            ],
            defaultIndex: 0
          }
        ],
        addressValue: ['', '', ''],
        addressSlots: [
          {
            values: provinces,
            defaultIndex: 0
          },
          {
            values: getAreas(provinces[0])
          },
          {
            values: []
          }
        ]
      }
    },
    props: { // props data

    },
    methods: { // methods
      confirm (values) {
        alert(JSON.stringify(values))
      },
      cancel (values) {
        alert(values)
      },
      ticketChg (value) {
        this.ticketValue = value
      },
      initCity (province) {
        if (!province) {
          return
        }
        let citys = getCities(province) || []
        if (citys.length) {
          this.addressSlots.splice(1, 1, {
            values: citys,
            defaultIndex: 0
          })
          this.addressValue[1] = citys[0]
        }
        return citys[0]
      },
      initArea (province, city) {
        if (!province || !city) {
          return
        }
        let areas = getAreas(province, city)
        if (areas.length) {
          this.addressSlots.splice(2, 1, {
            values: areas,
            defaultIndex: 0
          })
          this.addressValue[2] = areas[0]
        }
        return areas[0]
      },
      onAddressChange (value, index) {
        if (index === 0 && value) {
          this.addressValue.splice(0, 1, value)
          let city = this.initCity(value)
          this.initArea(value, city)
        }

        if (index === 1 && value) {
          this.addressValue.splice(1, 1, value)
          let province = this.addressValue[0] || provinces[0]
          this.initArea(province, value)
        }

        if (index === 2 && value) {
          this.addressValue.splice(2, 1, value)
        }
      }
    }
  }
</script>

<style scoped>
  .weui-btn {
    margin-bottom: 10px;
  }
</style>
