<template>
  <div>
    <div class="weui-cells__title" v-if="title" v-text="title"></div>
    <div class="weui-cells">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Cells',
    data: function () {  // store data
      return {}
    },
    props: { // props data
      title: String
    }
  }
</script>

