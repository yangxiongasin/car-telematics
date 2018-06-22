<template>
  <div>
    <transition :name="transitionName">
      <router-view class="child-view" style="padding-bottom:3.06rem;"></router-view>
    </transition>
    <y-tabbar v-model="tabbar">
      <y-tabbar-item id='monitor' class="y-icon">
        <i class="weui-icon-ai-eye"  slot="icon-normal"></i>
        <i class="weui-icon-ai-eye icon_active"  slot="icon-active"></i>
        <span>监控</span>
      </y-tabbar-item>
      <y-tabbar-item id='service' >
        <i class="weui-icon-ai-map-marker"  slot="icon-normal"></i>
        <i class="weui-icon-ai-map-marker icon_active"  slot="icon-active"></i>
        <span>服务</span>
      </y-tabbar-item>
      <div  class="mon_scan" @click="toRealPhoto">
        <div class="flex_center scan_icon">
          <i class="weui-icon-ai-camera"></i>
        </div>
      </div>
      <y-tabbar-item id='helpful' >
        <i class="weui-icon-ai-lightbulb-outline"  slot="icon-normal"></i>
        <i class="weui-icon-ai-lightbulb"  slot="icon-active"></i>
        <span>帮助</span>
      </y-tabbar-item>
      <y-tabbar-item id='userInfo'>
        <i class="weui-icon-ai-account-outline"  slot="icon-normal"></i>
        <i class="weui-icon-ai-account"  slot="icon-active"></i>
        <span>用户</span>
      </y-tabbar-item>
    </y-tabbar>
  </div>
</template>

<script>
  import yTabbar from '../../components/tabbar/tabbar'
  import yTabbarItem from '../../components/tabbar/tabbar-item'

  import wxMinxin from './mixin/wx-api'
  export default {
    name: 'index',
    mixins: [wxMinxin],
    components: {
      yTabbar,
      yTabbarItem
    },
    methods: {
      toRealPhoto () {
        this.$router.push({name: 'realPhoto'})
      }
    },
    computed: {
      tabbar: {
        get () {
          let path = this.$store.state.route.path
          let result = 'monitor'
          if (path) {
            let arr = path.replace('/views/monitoring/', '').split('/')
            result = arr[0]
          } else {
            result = 'monitor'
          }
          this.select = result
          return result
        },
        set: function (id) {
          this.$router.push('/views/monitoring/' + id)
        }
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    data () {
      return {
        transitionName: '',
        select: this.tabbar
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.meta && from.meta && to.meta.level && from.meta.level) {
          if (to.meta.level >= from.meta.level) {
            this.transitionName = 'slideIn'
          } else {
            this.transitionName = 'slideOut'
          }
        }
      }
    }
  }
</script>

<style lang="less" >
</style>
