<template>
  <m-swipe :content="ads" contentKey="imageUrl">
  </m-swipe>
</template>

<script>
  export default {
    data: function () {  // store data
      return {
        arr: [1, 2]
      }
    },
    computed: {
      ads () {
        return this.$store.state.equModelsAds
      }
    },
    props: { // props data

    },
    methods: { // methods

    },
    created () {
      this.$store.dispatch('getSwipeData')
    }
  }
</script>

<style scoped>
  .weui-swipe {
    height: 200px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
  }

  .weui-swipe-item {
    line-height: 200px;
  }
  .slide1 {
    background-color: #0089dc;
    color: #fff;
  }

  .slide2 {
    background-color: #ffd705;
    color: #000;
  }

  .slide3 {
    background-color: #ff2d4b;
    color: #fff;
  }
</style>
