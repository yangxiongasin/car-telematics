<template>
    <div v-html="msg">
    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        msg: ''
      }
    },
    mounted () {
      let vm = this
      vm.msg = vm.$route.params.id
      let title = vm.msg.slice(vm.msg.indexOf('<title>') + 7, vm.msg.indexOf('</title>'))
      document.title = title
      vm.$route.meta.title = title
    }
  }
</script>
