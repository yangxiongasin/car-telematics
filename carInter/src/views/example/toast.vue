<template>
  <div>
    <a href="javascript:;" class="weui-btn weui-btn_primary" @click="defaultToast">默认</a>
    <a href="javascript:;" class="weui-btn weui-btn_primary" @click="customer">自定义图标</a>
    <a href="javascript:;" class="weui-btn weui-btn_primary" @click="success">success</a>
    <a href="javascript:;" class="weui-btn weui-btn_primary" @click="loading">loading</a>
  </div>
</template>

<script>
  export default {
    data: function () {  // store data
      return {}
    },
    methods: { // methods
      defaultToast () {
        this.$Toast({
          message: '默认的toast'
        })
      },
      customer () {
        this.$Toast({
          message: '自定义的toast',
          iconClass: 'weui-icon-success-no-circle',
          duration: 3000
        })
      },
      success () {
        this.Toast.success('成功的toast')
      },
      loading () {
        this.Toast.loading('数据加载中')
      }
    }
  }
</script>

<style scoped>
</style>
