<template>
  <m-cells>
    <m-cell-swipe title="标题文字" desc="查看" @on-delete="handleDelete"></m-cell-swipe>
    <m-cell-swipe title="标题文字">
      <template slot="right">
        <a class="weui-swiped-btn weui-swiped-btn_default" @touchend="handleDelete">查看</a>
        <a class="weui-swiped-btn weui-swiped-btn_warn" @touchend="handleDelete">删除</a>
      </template>
    </m-cell-swipe>
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
      handleDelete () {
        alert('点击了删除')
      }
    }
  }
</script>

<style scoped>
</style>
