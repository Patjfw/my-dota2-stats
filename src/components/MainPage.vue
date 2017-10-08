<template lang="html">
  <recent-games :account_id=account_id></recent-games>
</template>

<script>
import RecentGames from './RecentGames'

const ACCOUNT_ID = 86782354

export default {
  data () {
    return {
      account_id: ACCOUNT_ID
    }
  },
  components: {
    RecentGames
  }
}
</script>

<style lang="sass">
</style>
