<template>
  <div>
    <m-button @click="isShowActionSheet=true">弹出ActionSheet</m-button>
    <m-action-sheet v-model="isShowActionSheet" titleText="这是一个标题"
                    :menus="menus" @menu-item-click="handleMenuClick"></m-action-sheet>
  </div>

</template>

<script>
  export default {
    data: function () {  // store data
      return {
        isShowActionSheet: false,
        menus: ['示例菜单', '示例菜单', '示例菜单', '示例菜单']
      }
    },
    props: { // props data

    },
    methods: { // methods
      toggleActionSheet () {
        this.isShowActionSheet = true
      },
      handleMenuClick (item, index) {
        console.log(item)
        console.log(index)
      }
    }
  }
</script>

<style scoped>
</style>
