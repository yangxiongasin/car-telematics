<template>
  <div class="weui-picker__group" ref="component">
    <div class="weui-picker__mask"></div>
    <div class="weui-picker__indicator" ref="indicator"></div>
    <div class="weui-picker__content" ref="content">
      <div class="weui-picker__item" :class="{ 'weui-picker__item_disabled': typeof item === 'object' && item['disabled'], 'selected': currentIndex === index}" v-for="(item, index) in mutatingValues" :key="index">{{ typeof item === 'object' && item[valueKey] ? item[valueKey] : item }}</div>
    </div>
  </div>
</template>

<script>
  // 每个选项高度
  // const ITEM_HEIGHT = 34
  // 可见选项个数
  // const VISIBLE_ITEM_COUNT = 7
  import Scroller from '@/utils/Scroller.js'
  import {getComputedStyle} from '@/utils/assist.js'
  export default {
    name: 'MPickerSlot',
    data: function () {  // store data
      return {
        startTime: 0,
        startDistance: 0,
        lastDistance: 0,
        scroller: null,
        currentValue: this.value,
        currentIndex: -1,
        mutatingValues: this.values,
        itemHeight: 0,
        distance: 0,
        duration: 0.3,
        offset: 0,
        minScrollTop: 0,
        maxScrollTop: 0
      }
    },
    props: { // props data
      values: {
        type: Array,
        default () {
          return []
        }
      },
      value: {},
      valueKey: String,
      defaultIndex: {
        type: Number,
        default: -1
      },
      bindIndex: Number,
      isShow: Boolean
    },
    computed: {
      indicatorIndex () {
        return Math.floor(this.mutatingValues.length / 2)
      },
      maxTranslate () {
        return this.offset * this.itemHeight
      },
      minTranslate () {
        return -(this.itemHeight * (this.mutatingValues.length - this.offset - 1))
      }
    },
    methods: { // methods
      setTranslate (translate, time) {
        time = time || 0
        let distance = translate
        let content = this.$refs.content
        this.distance = distance
        content.style.webkitTransform = 'translate3d(0, ' + distance + 'px, 0)'
        content.style.transform = 'translate3d(0, ' + distance + 'px, 0)'
        content.style.webkitTransition = `all ${time}s`
        content.style.transition = `all ${time}s`
      },
      getMax (offset, rowHeight) {
        return offset * rowHeight
      },
      getMin (offset, rowHeight, length) {
        return -(rowHeight * (length - offset - 1))
      },
      getDefaultIndex () {
        const items = this.mutatingValues
        let current = -1
        if (this.defaultIndex !== -1) {
          current = this.defaultIndex
        } else {
          current = this.indicatorIndex
        }
        let count = 0
        while (!!items[current] && items[current].disabled) {
          current = ++current % items.length
          count++
          if (count > items.length) {
            throw new Error('No selectable item.')
          }
        }
        return current
      },
      getDefaultTranslate (offset) {
        const currentIndex = this.getDefaultIndex()
        this.currentIndex = currentIndex
        return (offset - currentIndex) * this.itemHeight
      },
      /**
       * // 修正translate
       * @param distance
       */
      fixTranslate (distance) {
        // 移动到最接近的那一行
        let translate = Math.round(distance / this.itemHeight) * this.itemHeight
        // 不要超过最大值或者最小值
        if (translate > this.maxTranslate) {
          translate = this.maxTranslate
        }
        if (translate < this.minTranslate) {
          translate = this.minTranslate
        }
        // 如果是 disabled 的就跳过
        let index = this.offset - (translate / this.itemHeight)
        const diff = this.mutatingValues.length - index - 1
        while (!!this.mutatingValues[index] && this.mutatingValues[index].disabled) {
          diff > 0 ? ++index : --index
        }
        translate = (this.offset - index) * this.itemHeight
        return translate
      },
      touchStartHandler (e) {
        if (e.target.tagName.match(/input|textarea|select/i)) {
          return
        }
        e.preventDefault()
        this.startTime = new Date().getTime()
        this.scroller.doTouchStart(e.touches, e.timeStamp)
      },
      touchMoveHandler (e) {
        this.startTime = +new Date().getTime()
        this.lastDistance = this.distance
        this.scroller.doTouchMove(e.touches, e.timeStamp)
      },
      /**
       *       * * 思路:
       * 0. touchstart 记录按下的点和时间
       * 1. touchmove 移动时记录前 40个经过的点和时间
       * 2. touchend 松开手时, 记录该点和时间. 如果松开手时的时间, 距离上一次 move时的时间超过 100ms, 那么认为停止了, 不执行惯性滑动
       *    如果间隔时间在 100ms 内, 查找 100ms 内最近的那个点, 和松开手时的那个点, 计算距离和时间差, 算出速度
       *    速度乘以惯性滑动的时间, 例如 300ms, 计算出应该滑动的距离
       * @param e
       */
      touchEndHandler (e) {
        this.scroller.doTouchEnd(e.timeStamp)
        const endTime = new Date().getTime()
        const endDistance = this.distance
        const timeDiff = endTime - this.startTime
        const gap = endDistance - this.startDistance
        const distanceDiff = endDistance - this.lastDistance
        let diff = 0
        // 如果上次时间距离松开手的时间小于 100ms, 执行惯性滑动
        if (timeDiff < 100) {
          if (Math.abs(gap) > 10) {
            const v = distanceDiff / timeDiff // 出手时的速度
            diff = v * 150 + (distanceDiff) // 滑行 150ms,这里直接影响“灵敏度”
          }
        }
        let translate = this.fixTranslate(this.distance + diff)
        this.setTranslate(translate, 0.3)
        let index = this.offset - (translate / this.itemHeight)
        this.selectItem(index)
      },
      selectItem (index) {
        this.currentIndex = index
        this.currentValue = this.mutatingValues[index]
      },
      initTranslate () {
        let indicator = this.$refs.indicator
        let itemHeight = parseFloat(getComputedStyle(indicator, 'height'), 10)
        let indicatorTop = parseFloat(getComputedStyle(indicator, 'top'), 10)
        this.itemHeight = itemHeight
        let offset = Math.floor(indicatorTop / itemHeight)
        this.offset = offset
        const translate = this.getDefaultTranslate(offset)
        this.setTranslate(translate)
      },
      init () {
        if (this.scroller) {
          return
        }
        this.initTranslate()
        this.initscroll()
      },
      initscroll () {
        if (this.scroller) {
          return
        }
        let vm = this
        let component = this.$refs.component
        if (!this.scroller) {
          this.scroller = new Scroller(function (left, top, zoom) {
            let distance = top === 0 ? 0 : -top
            vm.setTranslate(distance)
          }, {
            scrollingX: false
          })
        }
        component.addEventListener('touchstart', this.touchStartHandler, false)
        component.addEventListener('touchmove', this.touchMoveHandler, false)
        component.addEventListener('touchend', this.touchEndHandler, false)
      }
    },
    watch: {
      values (val) {
        this.mutatingValues = val
        if (this.currentIndex !== -1) {
          this.initTranslate()
        }
      },
      isShow (val) {
        if (val) {
          this.init()
        }
      },
      currentIndex (index) {
        this.$parent.slotValueChange(this.mutatingValues[index], this.bindIndex)
      }
    }
  }
</script>

