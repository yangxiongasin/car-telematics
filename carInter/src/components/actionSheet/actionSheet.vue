<template>
  <div>
    <transition name="fade">
    <div class="weui-mask" v-show="visible"  @click.stop="visible=false"></div>
    </transition>
    <div class="weui-actionsheet" :class="{'weui-actionsheet_toggle': visible}">
      <div class="weui-actionsheet__title" v-if="titleText">
        <p class="weui-actionsheet__title-text" v-text="titleText"></p>
      </div>
      <div class="weui-actionsheet__menu">
        <div class="weui-actionsheet__cell" v-for="(item, index) in menus"
             @click.stop="itemClick(item, index)"
             v-html="item"></div>
      </div>
      <div class="weui-actionsheet__action" @click.stop="visible=false">
        <div class="weui-actionsheet__cell" v-text="cancelText"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {  // store data
      return {
        visible: false
      }
    },
    props: { // props data
      menus: {
        type: Array,
        default: () => []
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      titleText: {
        type: String,
        default: ''
      },
      value: Boolean
    },
    methods: { // methods
      itemClick (item, index) {
        this.$emit('menu-item-click', item, index)
      }
    },
    watch: {
      visible (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.visible = val
      }
    },
    mounted () {
      if (this.value) {
        this.visible = true
      }
    }
  }
</script>

