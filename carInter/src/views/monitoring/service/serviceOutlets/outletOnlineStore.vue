<template>
    <div class="outletOnlineStore">
      <m-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
        <div class="border_bm_18" style="padding-bottom: 3rem;" v-if="!noShopData">
          <div v-for="item in sel_shopData">
            <div class="y_label font_7B_75 flex_cen_bet">
              <span>
                门店编号：{{item.dotCode}}
              </span>
              <span>
                {{item.distance}}
              </span>
            </div>
            <div class="sel_shop_content ">
              <div class="flex_wrap_end">
                <div class="font_2D_88_156 color_918_639" @click="jumpServiceMap(item)">{{item.dotName}}</div>
              </div>
              <div class="font_7B_88">{{item.dotAddr}}</div>
            </div>
          </div>
        </div>
        <div class="realMedia no-photos" v-if="noShopData">
          <div class="realPhotoTitle flex_center_col">
            <div class="font_7B_1" style="text-align: center" >
              <i class="weui-icon-ai-share-variant" style="font-size: 5rem"></i>
              <p class="pd_top_88">当前区域暂无服务网点</p>
            </div>
          </div>
        </div>
      </m-scroll>
    </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        sel_shopData: [],
        paramsDate: {},
        noShopData: false
      }
    },
    methods: {
      init () {
        let vm = this
        vm.$http.post(vm.$service.service.getOnlineStore, vm.paramsDate).then(data => {
          if (data !== null) {
            if (data.data && (data.length === 0 || !data.data.storeList || data.data.storeList.length === 0)) {
              this.$el.querySelector('.load-more').innerHTML = ''
              this.noShopData = true
              return
            }
            vm.sel_shopData = data.data.storeList
            let totalCount = data.data.pageInfo.totalCount
            if (vm.sel_shopData.length === 0) {
              this.$el.querySelector('.load-more').innerHTML = ''
              this.noShopData = true
            } else if (vm.sel_shopData.length === totalCount) {
              this.$el.querySelector('.load-more').innerHTML = '已全部加载'
              this.noShopData = false
            } else {
              this.noShopData = false
            }
            vm.changeDistance(vm.sel_shopData)
          } else {
            this.$el.querySelector('.load-more').innerHTML = '加载门店不成功'
          }
        })
      },
      changeDistance (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].distance = Number.parseInt(data[i].distance)
          if (data[i].distance < 100) {
            data[i].distance = '<100m'
          } else if (data[i].distance > 1000) {
            data[i].distance = (data[i].distance / 1000).toFixed(2) + 'km'
          } else {
            data[i].distance = data[i].distance + 'm'
          }
        }
      },
      jumpServiceMap (item) {
        this.$router.push({
          name: 'outerOnlineStoreMap',
          params: {
            item: item
          }
        })
      },
      // 下拉刷新
      onRefresh (done) {
        this.paramsDate.currentPage = 1
        this.init()
        done()
      },
      // 上滑增加数据 目前为模拟数据，所以数据值值只能为一次性全部获取
      onInfinite (done) {
        let vm = this
        this.paramsDate.currentPage++
        if (this.$el.querySelector('.load-more').innerHTML !== '已全部加载') {
          vm.$http.post(vm.$service.service.getOnlineStore, vm.paramsDate).then(data => {
            vm.changeDistance(data.data.storeList)
            for (let i = 0; i < data.data.storeList.length; i++) {
              vm.sel_shopData.push(data.data.storeList[i])
            }
            let totalCount = data.data.pageInfo.totalCount
            if (vm.sel_shopData.length === totalCount) {
              this.$el.querySelector('.load-more').innerHTML = '已全部加载'
            }
          })
        }
      }
    },
    computed: {
      ParamsDate () {
        return this.$store.state.ParamsDate
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      let vm = this
      vm.paramsDate = vm.ParamsDate
      this.init()
    }
  }
</script>
