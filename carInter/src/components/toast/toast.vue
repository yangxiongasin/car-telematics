<template>
  <transition name="fade">
    <div v-show="visible">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast-addr">
        <div class="weui-toast">
          <i class="weui-icon_toast" :class="iconClass" v-if="iconClass"></i>
          <p class="weui-toast__content" v-html="message"></p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Toast',
    props: {
      message: String,
      duration: {
        type: Number,
        default: 2000
      },
      iconClass: {
        type: String, // weui-icons-success-no-circle
        default: ''
      }
    },
    data: function () {  // store data
      return {
        visible: true,
        timer: null
      }
    },
    mounted () {
      if (this.duration) {
        this.countTime()
      }
    },
    methods: { // methods
      countTime () {
        const vm = this
        if (vm.timer) {
          clearTimeout(this.timer)
          vm.timer = null
        }
        vm.timer = setTimeout(function () {
          vm.destroy()
        }, vm.duration)
      },
      close () {
        this.visible = false
      },
      show () {
        this.visible = true
      },
      destroy () {
        this.close()
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el)
        }
      }
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
