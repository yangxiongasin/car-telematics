<template>
    <div class="getPassword">
      <div>
        <span>请在设备的【主页】-【系统设置】-【系统设置】-【微信访问密码页面】，获取密码</span>
      </div>
      <div class="img_100 mr_top_5">
        <img :src="imageSrc" alt="">
      </div>
      <m-button size="large" type="primary" class="mr_top_10" @click="getback" >返回</m-button>
    </div>
</template>

<script>
  import wxMinxin from '../monitoring/mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        imageSrc: ''
      }
    },
    methods: {
      init () {
        let vm = this
        vm.$http.post(vm.$service.getPwdGuide, {}).then(data => {
          if (data.data && data.data.imageUrl) {
            vm.imageSrc = data.data.imageUrl
          }
        })
      },
      // 点击返回跳到我的设备界面
      getback () {
        this.$router.push({name: 'myEqui'})
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
