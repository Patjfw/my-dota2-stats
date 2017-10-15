<template lang="html">
  <div>
    <div class="">
      比赛{{$route.params.match_id}}
    </div>
  </div>
</template>

<script>
  import { detailsFetch } from './mixins/detailsFetch'

  export default {
    name: 'GameDetails',
    mixins: [detailsFetch],
    methods: {
    }
  }
</script>

<style lang="sass">
</style>
