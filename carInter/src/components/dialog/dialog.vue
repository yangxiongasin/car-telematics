<template>
  <transition name="fade">
    <div v-show="visible">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast-addr" @click="close">
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
    name: 'MDialog',
    props: {
      message: String,
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
    watch: {
      visible (newValue) {
        if (newValue === false) {
          this.destroy()
        }
      }
    },
    methods: { // methods
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
