<template>
  <div class="scoller-container" ref="container">
    <div class="scoller-content-wrap">
      <header class="pull-refresh" ref="refreshElem">
        <slot name="pull-refresh">
          <span class="font_7B_113" v-text="pullText"></span>
        </slot>
      </header>
      <div class="scoller-content" ref="content">
        <slot></slot>
      </div>
      <footer class="load-more" v-show="loadingText">
        <slot name="load-more">
          <span class="font_7B_113" v-text="loadingText"></span>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
  import Scroller from '@/utils/Scroller.js'
  export default {
    data: function () {  // store data
      return {
        scroller: null,
        direction: '',
        pullText: '下拉更新',
        isRefreshing: false
      }
    },
    props: { // props data
      loadingText: {
        type: String,
        default: ''
      }
    },
    methods: { // methods
      updateDimensions () { // Fill Scroller
        const content = this.$refs.content
        const container = this.$refs.container
        const refreshElemHeight = this.$refs.refreshElem.clientHeight
        // Update Scroller dimensions for changed content
        this.scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight - refreshElemHeight)
      },
      setTranslate (left, top, zoom) {
        const container = this.$refs.container
        container.style.transform = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')'
        container.style.webkitTransform = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')'
      },
      refreshOver () {
        const vm = this
        const refreshElem = this.$refs.refreshElem
        refreshElem.className = refreshElem.className.replace(' running', '')
        vm.updateDimensions()
        vm.scroller.finishPullToRefresh()
      }
    },
    mounted () {
      const vm = this
      if (!vm.scroller) {
        const container = this.$refs.container
        const refreshElem = this.$refs.refreshElem
        vm.scroller = new Scroller(function (left, top, zoom) {
          if (top > 0) {
            vm.direction = 'up' // push
          } else if (top < 0) {
            vm.direction = 'down' // pull
          } else {
            vm.direction = ''
          }
          vm.setTranslate(left, top, zoom)
        }, {
          scrollingX: false,
          animating: false
        })
        // Activate pull-to-refresh
        const pullHeight = refreshElem.clientHeight
        vm.scroller.activatePullToRefresh(pullHeight, function () {
          refreshElem.className += ' active'
          vm.pullText = '松开更新'
          vm.isRefreshing = false
        }, function () {
          refreshElem.className = refreshElem.className.replace(' active', '')
          vm.pullText = '下拉更新'
          vm.isRefreshing = false
        }, function () {
          refreshElem.className += ' running'
          vm.pullText = '更新中...'
          vm.isRefreshing = true
          vm.$emit('on-refresh', vm.refreshOver)
        })
        let startPageY = 0
        // bind events
        container.addEventListener('touchstart', function (e) {
          // Don't react if initial down happens on a form element
          if (e.target.tagName.match(/input|textarea|select/i)) {
            return
          }
          startPageY = e.changedTouches[0].pageY
          vm.scroller.doTouchStart(e.touches, e.timeStamp)
          // e.preventDefault()
          e.stopPropagation()
        }, false)

        container.addEventListener('touchmove', function (e) {
          vm.scroller.doTouchMove(e.touches, e.timeStamp)
        }, false)

        container.addEventListener('touchend', function (e) {
          const endPageY = e.changedTouches[0].pageY
          vm.scroller.doTouchEnd(e.timeStamp)
          if (vm.direction !== 'down') {
            const gap = startPageY - endPageY
            if (gap > 50 && gap > 0) {
              vm.$emit('on-infinite') // 加载数据
            }
          }
        }, false)
      }
    }
  }
</script>

<style scoped>
</style>
