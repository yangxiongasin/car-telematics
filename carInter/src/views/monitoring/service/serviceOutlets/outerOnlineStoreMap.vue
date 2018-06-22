<template>
  <div class="pathMap">
    <div id="pathMap_img">
      <div class="pathMap_loading flex_center">地图正在加载...</div>
    </div>
    <div class="wp_head flex_cen_bet font_7B_75 mr_top_125">
      {{getDate}}
    </div>
    <div class="weui-flex wp_content">
      <i class="weui-icon-ai-map-marker font_7B_88"></i>
      <div class="">
        <div class="weui-flex">
          <span class="font_2D_1">{{mess.dotName}}</span>
        </div>
        <div class="weui-flex">
          <span class="font_7B_88">{{mess.dotAddr}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mapMixin from '../../mixin/map-position'
  import {getChangeDate} from '@/utils/assist.js'
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin, mapMixin],
    data () {
      return {
        mess: ''
      }
    },
    computed: {
      getDate () {
        return getChangeDate()
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    methods: {
     // as
    },
    mounted () {
      let vm = this
      this.mess = this.$route.params.item
      vm.initMap('pathMap_img', true, vm.mess.lng, vm.mess.lat)
    }
  }
</script>
