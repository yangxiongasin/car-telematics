<template lang="html">
  <div class="yo-scroll"
  :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
  @touchstart="touchStart($event)"
  @touchmove="touchMove($event)"
  @touchend="touchEnd($event)"
  @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : console.log('nonono')">
    <div class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
      <header class="pull-refresh">
        <slot name="pull-refresh">
           <span class="down-tip font_7B_113">下拉更新</span>
           <span class="up-tip font_7B_113">松开更新</span>
           <span class="refresh-tip font_7B_113">更新中</span>
        </slot>
      </header>
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <span class="font_7B_113" v-text="loadText"></span>
        </slot>
      </footer>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 40
    },
    offsetY: {
      type: Number,
      default: 40
    },
    enableInfinite: {
      type: Boolean,
      default: true
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    onRefresh: {
      type: Function,
      default: undefined,
      required: false
    },
    onInfinite: {
      type: Function,
      default: undefined,
      require: false
    }
  },
  data () {
    return {
      top: 0,
      state: 0,
      startY: 0,
      EndY: 0,
      touching: false,
      infiniteLoading: false,
      loadText: ''
    }
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
      this.startScroll = this.$el.scrollTop || 0
      this.touching = true
    },
    touchMove (e) {
      if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
        return
      }
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
      if (diff > 0) e.preventDefault()
      this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
      if (this.state === 2) { // in refreshing
        return
      }
      if (this.top >= this.offset) {
        this.state = 1
      } else {
        this.state = 0
      }
    },
    touchEnd (e) {
      let vm = this
      vm.EndY = e.changedTouches[0].pageY // 获取第一个触点
      let lmHeight = this.$el.querySelector('.load-more').clientHeight // 获取下拉加载的高度
      let scHeight = this.$el.scrollHeight // 获取整个页面的高度
      let clHeight = this.$el.clientHeight // 获取页面可视的高度
      let scTop = this.$el.scrollTop // 获取滑条滑动的高度
      if (!this.enableRefresh) return
      this.touching = false
      if (this.state === 2) { // in refreshing
        this.state = 2
        this.top = this.offset
        return
      }
      if ((vm.EndY - vm.startY) < -lmHeight && (scHeight - scTop) <= clHeight) {
        this.infinite(this.infiniteDone)
      }
      if (this.top >= this.offset) { // do refresh
        this.refresh()
      } else { // cancel refresh
        this.state = 0
        this.top = 0
      }
    },
    refresh () {
      this.state = 2
      this.top = this.offset
      this.onRefresh(this.refreshDone)
    },
    refreshDone () {
      this.state = 0
      this.top = 0
    },

    infinite () {
      this.infiniteLoading = true
      this.onInfinite(this.infiniteDone)
      this.loadText = '加载中...'
    },

    infiniteDone () {
      this.infiniteLoading = false
      this.$el.querySelector('.load-more').innerHTML = ''
      this.loadText = ''
    },

    onScroll (e) {
    }
  }
}
</script>
