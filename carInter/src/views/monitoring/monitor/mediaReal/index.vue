<template>
  <div class="mediaReal">
    <div class="flex_cen_bet mediaReal_title">
      <div v-for='(item, index) in data' v-text="item.name"
           :class="{curSelect:iscur===index}" class="tabMedia weui-flex" @click="switchCover(item, index)"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        iscur: 0,
        data: [
          {
            name: '实时照片',
            src: 'realPhoto'
          },
          {
            name: '实时视频',
            src: 'realVideo'
          }
        ]
      }
    },
    methods: {
      switchCover (item, index) {
        this.iscur = index
        this.$router.replace({name: item.src})
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    created () {
      let vm = this
      if (vm.$router.history.current.path === '/views/monitoring/monitor/mediaReal/realVideo') {
        vm.iscur = 1
      }
    }
  }
</script>
