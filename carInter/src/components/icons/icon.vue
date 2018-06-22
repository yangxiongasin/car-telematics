<template>
  <i :class="iconClass"></i>
</template>

<script>
  export default {
    name: 'MIcon',
    computed: {
      iconClass () {
        return `weui-icon-${this.type}`
      }
    },
    props: {
      type: String
    },
    data: function () {  // store data
      return {}
    }
  }
</script>

