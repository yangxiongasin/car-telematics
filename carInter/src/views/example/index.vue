<template>
  <m-cells title="组件样例">
    <m-cell title="button" :isLink="true" @click.native="forward('button')"></m-cell>
    <m-cell title="toast" :isLink="true" @click.native="forward('toast')"></m-cell>
    <m-cell title="swipe" :isLink="true" @click.native="forward('swipe')"></m-cell>
    <m-cell title="lazyLoad" :isLink="true" @click.native="forward('lazyLoad')"></m-cell>
    <m-cell title="actionSheet" :isLink="true" @click.native="forward('actionSheet')"></m-cell>
    <m-cell title="cells" :isLink="true"  @click.native="forward('cells')"></m-cell>
    <m-cell title="cell-swipe" :isLink="true"  @click.native="forward('cell-swipe')"></m-cell>
    <m-cell title="form" :isLink="true"  @click.native="forward('form')"></m-cell>
    <m-cell title="picker" :isLink="true"  @click.native="forward('picker')"></m-cell>
    <m-cell title="icon" :isLink="true"  @click.native="forward('icons')"></m-cell>
    <m-cell title="scroll" :isLink="true"  @click.native="forward('scroll')"></m-cell>
    <m-cell title="index-list" :isLink="true"  @click.native="forward('index-list')"></m-cell>
    <m-cell title="wechat" :isLink="true"  @click.native="forward('wechat')"></m-cell>
  </m-cells>
</template>

<script>
  export default {
    data: function () {  // store data
      return {}
    },
    props: { // props data

    },
    methods: { // methods
      forward (page) {
        this.$router.push(`/example/${page}`)
      }
    }
  }
</script>

<style scoped>
</style>
