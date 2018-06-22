<template>
  <ul>
  <li v-for="item in imageList">
  <img v-lazy="item">
  </li>
  </ul>
</template>

<script>
  export default {
    data: function () {  // store data
      return {
        imageList: [
          'http://covteam.u.qiniudn.com/test19.jpg?imageView2/2/format/webpss',
          'http://covteam.u.qiniudn.com/test16.jpg?imageView2/2/format/webp',
          'http://fuss10.elemecdn.com/7/a5/596ab03934612236f807b92906fd8jpeg.jpeg'
        ]
      }
    },
    props: { // props data

    },
    methods: { // methods

    }
  }
</script>

<style scoped>
</style>
