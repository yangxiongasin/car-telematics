<template>
  <div class="weui-cell weui-cell_swiped"
       v-clickoutside:click="setDefaultTranslate"
       @click.stop="setDefaultTranslate" ref="component">
    <div class="weui-cell__bd" ref="left" >
      <cell :title="title" :desc="desc" slot="left"></cell>
      <slot></slot>
    </div>
    <div class="weui-cell__ft"  ref="right">
      <slot name="right">
        <a class="weui-swiped-btn weui-swiped-btn_warn flex_center" @click="handleDelete">删除</a>
      </slot>
    </div>
  </div>
</template>

<script>
  import Scroller from '@/utils/Scroller.js'
  import Cell from './cell.vue'
  import Clickoutside from '@/utils/clickoutside.js'
  export default {
    name: 'CellSwipe',
    components: {Cell},
    directives: { Clickoutside },
    data: function () {  // store data
      return {
        distance: 0,
        max: 0,
        scroller: null,
        $wrap: null,
        defaultTransform: 0,
        start: { x: 0, y: 0 }
      }
    },
    props: { // props data
      title: String,
      desc: String,
      icon: String
    },
    methods: { // methods
      setTranslate (offset, time) {
        offset = offset || 0
        if (this.$refs.left !== undefined) {
          this.$refs.left.style.webkitTransform = `translateX(${offset}px)`
          this.$refs.left.style.transform = `translateX(${offset}px)`
          this.$refs.left.style.webkitTransition = `all ${time}s`
          this.$refs.left.style.transition = `all ${time}s`
        }
      },
      setDefaultTranslate () {
        this.scroller.scrollTo(0, 0)
        this.setTranslate(0, 0.3)
      },
      startDrag (e) {
        if (e.target.tagName.match(/input|textarea|select/i)) {
          return
        }
        // e.preventDefault()
        e.stopPropagation()
        this.scroller.doTouchStart(e.touches, e.timeStamp)
      },
      onDrag (e) {
        this.scroller.doTouchMove(e.touches, e.timeStamp)
      },
      endDrag (e) {
        this.scroller.doTouchEnd(e.timeStamp)
        if (this.distance < this.max && this.distance > 0) {
          this.setTranslate(-this.max, 0.3)
        }
      },
      handleDelete (e) {
        this.setDefaultTranslate(0)
        this.$emit('on-delete')
      }
    },
    mounted () {
      let vm = this
      let component = this.$refs.left
      let client = this.$refs.right
      const max = vm.$refs.right.clientWidth
      this.max = max
      if (!this.scroller) {
        this.scroller = new Scroller(function (left, top, zoom) {
          if (left <= 0) {
            left = 0
          } else if (left > max) {
            left = -max
          } else {
            left = -left
          }
          vm.distance = -left
          vm.setTranslate(left, 0)
        }, {
          scrollingY: false
        })
        this.scroller.setDimensions(client.clientWidth, client.clientHeight, component.clientWidth, component.clientHeight)
      }
      component.addEventListener('touchstart', this.startDrag, false)
      component.addEventListener('touchmove', this.onDrag, false)
      component.addEventListener('touchend', this.endDrag, false)
    }
  }
</script>
