<template>
  <div class="notFound">
    <div class="col" style="margin-top: 40%">
      <h1>ERROR</h1>
      <p style="color: #f54f59;font-size: 1.2em;" >您必须使用微信内置浏览器访问页面</p>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  export default {
    data: function () {  // store data
      return {

      }
    },
    props: { // props data

    },
    methods: { // methods

    },
    mounted () {
      // 这里判断进入这个页面的方式是否为第一次进入公众号，如果是则不允许后退
      history.pushState(null, null, location.href)
      window.addEventListener('popstate', (event) => {
        wx.closeWindow()
        window.history.forward(1)
      }, false)
    }
  }
</script>

<style lang="less" scoped>
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizelegibility;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    background: #404853;
    font-family: 'Roboto Condensed', sans-serif;
  }
</style>
