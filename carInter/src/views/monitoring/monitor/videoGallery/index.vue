<template>
  <div class="mediaGallery">
    <m-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div class="realMedia no-videos" v-if="noVideos">
        <div class="realPhotoTitle flex_center_col">
          <div class="font_7B_1" style="text-align: center" >
            <i class="weui-icon-ai-camera" style="font-size: 5rem"></i>
            <p class="pd_top_88">近7天内没有拍摄视频</p>
          </div>
        </div>
      </div>
      <div class="operation" @click="sel_del" v-show="!noVideos">{{sel_del_btn}}</div>
      <div >
        <div class="flex_cen_bet pg_time font_2D_1">
        </div>
        <div class="pg_time_img flex_wrap_bet" >
          <div class="latelyPhoto_cont_img img_100" v-for="item in videoGallery">
            <m-media-detail :media="item"></m-media-detail>
            <label class="mock_mod flex_end_end" v-show="sel_model_show" :for="'vedioGallery' + item.serialCode">
              <input type="checkbox" name="photoSel" :value="item.serialCode"
                     :id="'vedioGallery' + item.serialCode" v-model="vedioCheckValue" @click="checkVal" class="weui-check">
              <i class="weui-icon-checked"></i>
              <i class="virtual_circle"></i>
            </label>
          </div>
        </div>
      </div>
    </m-scroll>
    <div class="delete_photo flex_center" v-show="del_photo">
      <div @click="subDel">
        <i class="weui-icon-delete subDelSty"></i>
      </div>
    </div>

    <m-action-sheet v-model="model_sure_del" cancelText="取消" :menus="menus" @menu-item-click="sure_del">

    </m-action-sheet>
  </div>
</template>

<script>
  import wxMinxin from '../../mixin/wx-api'
  export default {
    name: '',
    mixins: [wxMinxin],
    data () {
      return {
        noVideos: false,
        video: [], // 下拉更新数据存放数组
        menus: ['<span style="color:#ff5f5f;">确定删除</span>'], // actionSheet的子目录
        sel_del_btn: '选择', // 功能文字
        del_photo: false, // 顶部删除图标显示状态
        sel_model_show: false, // 图片上多选框蒙层显示状态
        model_sure_del: false, // 底部删除图标显示状态
        vedioCheckValue: [], // 选中视频的值

        counter: 1, // 默认已经显示出15条数据 count等于一是让从16条开始加载
        pageSize: 12,  // 一次显示多少条
        pageStart: 0, // 开始页数
        pageEnd: 0, // 结束页数
        videoGallery: [], // 下拉更新数据存放数组
        BindEquList: '' // 设备信息
      }
    },
    methods: {
      // 点击右上角a，如果文字为选择，那么多选框蒙层出现。底部删除图标显示状态，否则隐藏
      sel_del () {
        if (this.sel_del_btn === '选择') {
          this.vedioCheckValue = []
          this.sel_del_btn = '取消'
          this.del_photo = true
          this.sel_model_show = true
        } else {
          this.vedioCheckValue = []
          this.sel_del_btn = '选择'
          this.del_photo = false
          this.sel_model_show = false
        }
      },
      // 点击删除icon，如果没有选择图片则提示“请选择要删除的视频”，否则sheet出现
      subDel () {
        if (this.vedioCheckValue.length === 0) {
          this.$Toast({
            message: '请选择要删除的视频',
            iconClass: 'weui-icon-error',
            duration: 1000
          })
        } else {
          this.model_sure_del = true
        }
      },
      // 点击选中图片，如果为选中状态，将图片的值添加到checkval
      checkVal (evt) {
        if (evt.target.checked !== false) {
          let checkval = evt.target.value
          this.vedioCheckValue.push(checkval)
        }
      },
      // 确定删除
      sure_del (item, index) {
        let vm = this
        this.sel_del_btn = '选择'
        this.model_sure_del = false
        this.del_photo = false
        this.sel_model_show = false
        let code = vm.vedioCheckValue.join(',')
        let BindEquList = this.$store.getters.getDefaultDevice
        vm.$http.post(vm.$service.monitor.delMedia, {
          imei: BindEquList.imei,
          serialCode: code
        }).then(data => {
          if (data !== null) {
            vm.$Toast({
              message: '删除成功',
              iconClass: 'weui-icon-success-circle',
              duration: 800
            })
          }
          vm.getMedia()
        })
      },
      // 获取视频库数据
      getMedia () {
        let vm = this
        vm.BindEquList = this.$store.getters.getDefaultDevice
        vm.$http.post(this.$service.monitor.getMedia, {
          imei: vm.BindEquList.imei,
          mideaType: 1, // （0.图片；1：视频）
          currentPage: vm.counter, // （0.图片；1：视频）
          pageSize: vm.pageSize // （0.图片；1：视频）
        }).then(data => {
          if (data && data.data) {
            vm.videoGallery = data.data.mediaList
            if (data.data.mediaList.length === 0) {
              vm.noVideos = true
            } else {
              vm.noVideos = false
            }
            let totalCount = data.data.pagerInfo.totalCount
            if (vm.videoGallery.length === totalCount) {
              this.$el.querySelector('.load-more').style.display = 'none'
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 下拉刷新
      onRefresh (done) {
        this.counter = 1
        this.getMedia()
        this.$el.querySelector('.load-more').innerHTML = ''
        done()
      },
      // 上滑增加数据 目前为模拟数据，所以数据值值只能为一次性全部获取
      onInfinite (done) {
        let vm = this
        vm.counter++
        if (vm.$el.querySelector('.load-more').innerHTML !== '已全部加载') {
          vm.$http.post(this.$service.monitor.getMedia, {
            imei: vm.BindEquList.imei,
            mideaType: 1, // （0.图片；1：视频）
            currentPage: vm.counter,
            pageSize: vm.pageSize
          }).then(data => {
            for (let i = 0; i < data.data.mediaList.length; i++) {
              vm.videoGallery.push(data.data.mediaList[i])
            }
            let totalCount = data.data.pagerInfo.totalCount
            if (vm.videoGallery.length === totalCount) {
              this.$el.querySelector('.load-more').innerHTML = '已全部加载'
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },
    watch: {
      vedioCheckValue (val, oldval) {
        console.log(val)
      }
    },
    beforeCreate () {
      let vm = this
      vm.$on('handleWXReady', () => {
        vm.hideAllNonBaseMenuItem()
      })
    },
    mounted () {
      this.getMedia()
    }
  }
</script>
