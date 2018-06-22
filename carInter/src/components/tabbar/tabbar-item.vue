<template>
  <a class="y-tabbar-item flex_center_col"  :class="{'is-active':isActive}" @click="forward(id)">
    <span class="y-tabbar-item-icon" v-show="!isActive"><slot name="icon-normal"></slot></span>
    <span class="y-tabbar-item-icon" v-show="isActive"><slot name="icon-active"></slot></span>
    <span class="y-tabbar-item-text"><slot></slot></span>
  </a>
</template>
<script>
  export default{
    props: ['id'],
    computed: {
      isActive () {
        let page = this.$parent.value
        if (page === this.id) {
          return true
        }
      }
    },
    methods: {
      forward (id) {
        this.$parent.$emit('input', id)
      }
    }
  }
</script>
<style lang="less">
  .y-tabbar-item{
    flex: 1;
    .y-tabbar-item-icon{
      display: block;
      display: flex;
      display: -webkit-flex;
      justify-content:center;
      -webkit-justify-content:center;
      align-items: center;
      -webkit-align-items: center;
      img{
        width: 1.4rem;
        height: 1.4rem;
      }

    }
    .y-tabbar-item-text{
      display: block;
      font-size: 0.75rem;
      color: rgba(123,147,167,0.70);
    }
    &.is-active{
      .y-tabbar-item-text{
        background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#9185FF), to(#6392FF));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
</style>
