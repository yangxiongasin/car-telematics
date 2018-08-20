<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import {getPlatform, isWX} from '@/utils/assist.js'
export default {
  name: 'app',
  data () {
    return {
      transitionName: ''
    }
  },
  beforeCreate () {
    if (isWX() === false) {
      this.$router.push('/error')
    }
  },
  created () {
    this.$store.commit('setRootUrl', location.href.split('#')[0])
    if (this.$route.name === 'Error') {
      return
    }
    this.wxConfig()
    if (this.$route.meta && this.$route.meta.isSinger) {
      return
    }
    // 获取设备
    this.$store.dispatch('getBindEquList')
    // 获取用户信息
    this.$store.dispatch('getUserInfo')
    // sessionStorage.setItem('currentIllegallyStatus', JSON.stringify([]))
  },
  computed: {
    isIos () {
      return getPlatform() === 'ios'
    },
    noDevice () {
      const wxapi = this.isIos ? this.$store.state.weChat.ready : false
      return wxapi !== null && this.$store.state.noDevice === true
    },
    bindPhone () {
      const imei = this.$store.state.bindEquList.imei
      const userMobile = this.$store.state.userInfo.userMobile
      const nickName = this.$store.state.userInfo.nickName
      const wxapi = this.isIos ? this.$store.state.weChat.ready : false
      return !!(wxapi !== null && imei && !userMobile && nickName)
    },
    defaultDevicePW () {
      const imei = this.$store.state.bindEquList.imei
      const password = this.$store.state.bindEquList.password === true
      const userMobile = this.$store.state.userInfo.userMobile
      const nickName = this.$store.state.userInfo.nickName
      const wxapi = this.isIos ? this.$store.state.weChat.ready : false
      return !!(wxapi !== null && imei && password && userMobile && nickName)
    }
  },
  methods: {
    forward (page) {
      this.$router.push(`${page}`)
    },
    wxConfig (option) {
      const vm = this
      if (getPlatform() === 'ios') {
        // ios的微信中history模式不能改变url,需要使用首次加载的url签名
        vm.$store.dispatch('getWXAuth')
      }
    }
  },
  watch: {
    noDevice (newVal) {
      if (newVal === true) {
        let userMobile = this.$store.getters.getUserInfo.userMobile
        if (userMobile !== '') {
          this.forward(`/views/monitoring/service`)
        } else if (this.$route.meta.isCheckPassword === undefined) {
          this.forward('/views/bindingPhone')
        }
      }
    },
    '$route' (to, from) {
      this.Dialog.destroy()
      this.Toast.destroy()
      if (to.path === '/') {
        this.transitionName = 'slideOut'
      } else if (from.path === '/') {
        this.transitionName = 'slideIn'
      } else {
        if (to.meta && from.meta && to.meta.level && from.meta.level) {
          if (to.meta.level > from.meta.level) {
            this.transitionName = 'slideIn'
          } else {
            this.transitionName = 'slideOut'
          }
        }
      }
    },
    defaultDevicePW (newValue) {
      if (newValue === true) {
        const isShareMain = !!localStorage.getItem('share-main')
        if (isShareMain !== true && this.$route.meta.isCheckPassword === undefined) {
          if (!this.$route.query.directForward) {
            this.forward('/views/myEqui')
          }
        } else {
          localStorage.removeItem('share-main')
        }
      }
    },
    bindPhone (newValue) {
      if (newValue) {
        this.forward('/views/bindingPhone')
      }
    }
  }
}
</script>
