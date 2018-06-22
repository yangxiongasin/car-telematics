<template>
  <div class="views-wrap">
    <i class="pageIndexLoading"></i>
    <p class="weui-content">正在加载页面....</p>
  </div>
</template>
<script>
  import {getPlatform} from '@/utils/assist.js'
  export default {
    name: '',
    data () {
      return {
        msg: ''
      }
    },
    computed: {
      isIos () {
        return getPlatform() === 'ios'
      },
      ready () {
        const imei = this.$store.state.bindEquList.imei
        const nickName = this.$store.state.userInfo.nickName
        const userMobile = this.$store.state.userInfo.userMobile
        const noPassword = this.$store.state.bindEquList.password === false
        const wxapi = this.isIos ? this.$store.state.weChat.ready : false
        return !!(wxapi !== null && imei && noPassword && userMobile && nickName)
      }
    },
    watch: {
      ready (newValue) {
        if (newValue === true) {
          this.$router.push({name: 'monitorCar', params: {id: 'one'}})
//          this.forward(`/views/monitoring/monitor`)
        }
      }
    },
    methods: {
      forward (page) {
        this.$router.push(`${page}`)
      }
    }
  }
</script>
