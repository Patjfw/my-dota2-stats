<template>
  <div class="hello">
    <p @click='request'>test</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
    }
  },
  methods: {
    request: function () {
      console.log(111)
      axios({
        method: 'get',
        url: '/match_history',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
