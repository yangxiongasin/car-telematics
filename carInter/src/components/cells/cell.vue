<template>
  <div class="weui-cell" :class="{'weui-cell_access': isLink}">
    <slot name="icon">
      <div class="weui-cell__hd">
        <i v-if="icon" :class="icon"></i>
      </div>
    </slot>
    <div class="weui-cell__bd">
      <slot name="left">
        <div v-html="title"></div>
      </slot>
    </div>
    <div class="weui-cell__ft">
      <slot>{{desc}}</slot>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {  // store data
      return {}
    },
    props: { // props data
      title: String,
      desc: String,
      icon: String,
      isLink: Boolean
    },
    methods: { // methods

    }
  }
</script>

