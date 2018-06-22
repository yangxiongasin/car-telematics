<template>

    <m-cells title="首页导航">
      <m-cell title="组件样例" :isLink="true" @click.native="forward('/example')"></m-cell>
      <m-cell title="首页" :isLink="true" @click.native="forward('/views')"></m-cell>
    </m-cells>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'hello World'
      }
    },
    methods: {
      forward (page) {
        this.$router.push(`${page}`)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
a{
  margin: 0.5rem 0;
  display: block;
}
</style>


