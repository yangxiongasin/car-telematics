<template>
  <div class="weui-swipe">
    <div class="weui-swipe-items-wrap" ref="wrap">
      <swipe-item  v-for="(item, $index) in content" :class="{ 'is-active': $index === index }" :key="$index" >
        <img :src="contentKey? item[contentKey] : item" alt="">
      </swipe-item>
    </div>
    <div class="weui-swipe-indicators" v-show="showIndicators">
      <div class="weui-swipe-indicator"
           v-for="(page, $index) in content"
           :class="{ 'is-active': $index === index }"></div>
    </div>
  </div>
</template>

<script>
  import {addClass, removeClass, once} from '@/utils/assist.js'
  import swipeItem from './swipe-item.vue'
  export default {
    name: 'Swipe',
    components: {
      swipeItem
    },
    data: function () {  // store data
      return {
        ready: false,
        dragging: false,
        userScrolling: false,
        animating: false,
        index: this.defaultIndex,
        timer: null,
        reInitTimer: null,
        noDrag: false,
        isDone: false,
        noDragWhenSingle: true,
        dragState: {}
      }
    },
    props: { // props data
      speed: { // 动画持时（毫秒)
        type: Number,
        default: 300
      },
      defaultIndex: { // 初始显示的轮播图的索引
        type: Number,
        default: 0
      },
      auto: { // 自动播放的时间间隔（毫秒）
        type: Number,
        default: 3000
      },
      continuous: {// 是否可以循环播放
        type: Boolean,
        default: true
      },
      showIndicators: { // 是否显示 indicators
        type: Boolean,
        default: true
      },
      content: {
        required: true,
        type: Array
      },
      contentKey: String
    },
    watch: {
      content (newValue) {
        if (newValue.length) {
          this.initTimer()
        }
      }
    },
    methods: { // methods
      next () {
        this.doAnimate('next')
      },
      prev () {
        this.doAnimate('prev')
      },
      translate (element, offset, speed, callback) {
        if (speed) {
          this.animating = true
          element.style.webkitTransition = '-webkit-transform ' + speed + 'ms ease-in-out'
          setTimeout(() => {
            element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
          }, 50)

          var called = false

          var transitionEndCallback = () => {
            if (called) return
            called = true
            this.animating = false
            element.style.webkitTransition = ''
            element.style.webkitTransform = ''
            if (callback) {
              callback.apply(this, arguments)
            }
          }

          once(element, 'webkitTransitionEnd', transitionEndCallback)
          setTimeout(transitionEndCallback, speed + 100) // webkitTransitionEnd maybe not fire on lower version android.
        } else {
          element.style.webkitTransition = ''
          element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
        }
      },
      doAnimate (towards, options) {
        if (this.content.length < 2) return
        let prevPage = null
        let nextPage = null
        let currentPage = null
        let pageWidth = null
        let offsetLeft = null
        let speed = this.speed
        let index = this.index
        let pages = this.$children
        let pageCount = pages.length
        if (!options) {
          pageWidth = this.$el.clientWidth
          currentPage = pages[index].$el
          if (this.continuous && pages.length > 1) {
            prevPage = index === 0 ? pages[pageCount - 1].$el : pages[index - 1].$el
            nextPage = index === (pageCount - 1) ? pages[0].$el : pages[index + 1].$el
          }
          if (prevPage) {
            prevPage.style.display = 'block'
            this.translate(prevPage, -pageWidth)
          }
          if (nextPage) {
            nextPage.style.display = 'block'
            this.translate(nextPage, pageWidth)
          }
        } else {
          prevPage = options.prevPage
          currentPage = options.currentPage
          nextPage = options.nextPage
          pageWidth = options.pageWidth
          offsetLeft = options.offsetLeft
        }
        let newIndex
        var oldPage = this.$children[index].$el
        if (towards === 'prev') {
          if (index > 0) {
            newIndex = index - 1
          }
          if (this.continuous && index === 0) {
            newIndex = pageCount - 1
          }
        } else if (towards === 'next') {
          if (index < pageCount - 1) {
            newIndex = index + 1
          }
          if (this.continuous && index === pageCount - 1) {
            newIndex = 0
          }
        }
        let callback = () => {
          if (newIndex !== undefined) {
            var newPage = this.$children[newIndex].$el
            removeClass(oldPage, 'is-active')
            addClass(newPage, 'is-active')
            this.index = newIndex
          }
          if (this.isDone) {
            this.end()
          }
          if (prevPage) {
            prevPage.style.display = ''
          }
          if (nextPage) {
            nextPage.style.display = ''
          }
        }
        setTimeout(() => {
          if (towards === 'next') {
            this.isDone = true
            this.before(currentPage)
            this.translate(currentPage, -pageWidth, speed, callback)
            if (nextPage) {
              this.translate(nextPage, 0, speed)
            }
          } else if (towards === 'prev') {
            this.isDone = true
            this.before(currentPage)
            this.translate(currentPage, pageWidth, speed, callback)
            if (prevPage) {
              this.translate(prevPage, 0, speed)
            }
          } else {
            this.isDone = false
            this.translate(currentPage, 0, speed, callback)
            if (typeof offsetLeft !== 'undefined') {
              if (prevPage && offsetLeft > 0) {
                this.translate(prevPage, pageWidth * -1, speed)
              }
              if (nextPage && offsetLeft < 0) {
                this.translate(nextPage, pageWidth, speed)
              }
            } else {
              if (prevPage) {
                this.translate(prevPage, pageWidth * -1, speed)
              }
              if (nextPage) {
                this.translate(nextPage, pageWidth, speed)
              }
            }
          }
        }, 10)
      },
      doOnTouchStart (event) {
        if (this.noDrag) return

        var element = this.$el
        var dragState = this.dragState
        var touch = event.touches[0]

        dragState.startTime = new Date()
        dragState.startLeft = touch.pageX
        dragState.startTop = touch.pageY
        dragState.startTopAbsolute = touch.clientY

        dragState.pageWidth = element.offsetWidth
        dragState.pageHeight = element.offsetHeight

        var prevPage = this.$children[this.index - 1]
        var dragPage = this.$children[this.index]
        var nextPage = this.$children[this.index + 1]

        if (this.continuous && this.content.length > 1) {
          if (!prevPage) {
            prevPage = this.$children[this.$children.length - 1]
          }
          if (!nextPage) {
            nextPage = this.$children[0]
          }
        }

        dragState.prevPage = prevPage ? prevPage.$el : null
        dragState.dragPage = dragPage ? dragPage.$el : null
        dragState.nextPage = nextPage ? nextPage.$el : null

        if (dragState.prevPage) {
          dragState.prevPage.style.display = 'block'
        }

        if (dragState.nextPage) {
          dragState.nextPage.style.display = 'block'
        }
      },

      doOnTouchMove (event) {
        if (this.noDrag) return

        var dragState = this.dragState
        var touch = event.touches[0]

        dragState.currentLeft = touch.pageX
        dragState.currentTop = touch.pageY
        dragState.currentTopAbsolute = touch.clientY

        var offsetLeft = dragState.currentLeft - dragState.startLeft
        var offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute

        var distanceX = Math.abs(offsetLeft)
        var distanceY = Math.abs(offsetTop)
        if (distanceX < 5 || (distanceX >= 5 && distanceY >= 1.73 * distanceX)) {
          this.userScrolling = true
          return
        } else {
          this.userScrolling = false
          event.preventDefault()
        }
        offsetLeft = Math.min(Math.max(-dragState.pageWidth + 1, offsetLeft), dragState.pageWidth - 1)

        var towards = offsetLeft < 0 ? 'next' : 'prev'

        if (dragState.prevPage && towards === 'prev') {
          this.translate(dragState.prevPage, offsetLeft - dragState.pageWidth)
        }
        this.translate(dragState.dragPage, offsetLeft)
        if (dragState.nextPage && towards === 'next') {
          this.translate(dragState.nextPage, offsetLeft + dragState.pageWidth)
        }
      },

      doOnTouchEnd () {
        if (this.noDrag) return

        var dragState = this.dragState

        var dragDuration = new Date() - dragState.startTime
        var towards = null

        var offsetLeft = dragState.currentLeft - dragState.startLeft
        var offsetTop = dragState.currentTop - dragState.startTop
        var pageWidth = dragState.pageWidth
        var index = this.index
        var pageCount = this.content.length

        if (dragDuration < 300) {
          let fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop) < 5
          if (isNaN(offsetLeft) || isNaN(offsetTop)) {
            fireTap = true
          }
          if (fireTap) {
            this.$children[this.index].$emit('tap')
          }
        }

        if (dragDuration < 300 && dragState.currentLeft === undefined) return

        if (dragDuration < 300 || Math.abs(offsetLeft) > pageWidth / 2) {
          towards = offsetLeft < 0 ? 'next' : 'prev'
        }

        if (!this.continuous) {
          if ((index === 0 && towards === 'prev') || (index === pageCount - 1 && towards === 'next')) {
            towards = null
          }
        }

        if (this.$children.length < 2) {
          towards = null
        }

        this.doAnimate(towards, {
          offsetLeft: offsetLeft,
          pageWidth: dragState.pageWidth,
          prevPage: dragState.prevPage,
          currentPage: dragState.dragPage,
          nextPage: dragState.nextPage
        })

        this.dragState = {}
      },
      initTimer () {
        if (this.auto > 0 && !this.timer && this.content.length) {
          this.timer = setInterval(() => {
            if (!this.continuous && (this.index >= this.content.length - 1)) {
              return this.clearTimer()
            }
            if (!this.dragging && !this.animating) {
              this.next()
            }
          }, this.auto)
        }
      },
      clearTimer () {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
      this.timer = null
    },
    mounted () {
      this.ready = true
      if (this.content && this.content.length > 1) {
        this.initTimer()
        var element = this.$el
        element.addEventListener('touchstart', (event) => {
          event.preventDefault()
          event.stopPropagation()
          if (this.animating) return
          this.dragging = true
          this.userScrolling = false
          this.doOnTouchStart(event)
        })
        element.addEventListener('touchmove', (event) => {
          if (!this.dragging) return
          if (this.timer) this.clearTimer()
          this.doOnTouchMove(event)
        })
        element.addEventListener('touchend', (event) => {
          if (this.userScrolling) {
            this.dragging = false
            this.dragState = {}
            return
          }
          if (!this.dragging) return
          this.initTimer()
          this.doOnTouchEnd(event)
          this.dragging = false
        })
      }
    }
  }
</script>
