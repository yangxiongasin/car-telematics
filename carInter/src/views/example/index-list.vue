<template>
  <m-index-list :list="alphabet" :initials="initials" @on-check="check"></m-index-list>
</template>

<script>
  const NAMES = ['Aaron', 'Alden', 'Austin', 'Baldwin', 'Braden', 'Carl', 'Chandler', 'Clyde', 'David', 'Edgar', 'Elton', 'Floyd', 'Freeman', 'Gavin', 'Hector', 'Henry', 'Ian', 'Jason', 'Joshua', 'Kane', 'Lambert', 'Matthew', 'Morgan', 'Neville', 'Oliver', 'Oscar', 'Perry', 'Quinn', 'Ramsey', 'Scott', 'Seth', 'Spencer', 'Timothy', 'Todd', 'Trevor', 'Udolf', 'Victor', 'Vincent', 'Walton', 'Willis', 'Xavier', 'Yvonne', 'Zack', 'Zane']
  export default {
    data () {
      return {
        alphabet: [],
        initials: []
      }
    },
    methods: {
      check (value) {
        alert(value)
      }
    },
    created () {
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(initial => {
        let cells = NAMES.filter(name => name[0] === initial)
        this.initials.push(initial)
        this.alphabet.push({
          initial,
          cells
        })
      })
    }
  }
</script>

<style scoped>
</style>
