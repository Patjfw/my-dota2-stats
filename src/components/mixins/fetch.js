export const fetch = {
  methods: {
    getHeroID (match, accountID) {
      return match.players.find((item) => {
        return item.account_id === accountID
      }).hero_id
    },
    getHeroName (heroID) {
      return this.$store.state.heroesImageCache.result.heroes.find(function (item) {
        return item.id === heroID
      }).localized_name
    },
    getHeroImg (heroID) {
      // the result returned is unsorted, and missing some index, so can't use index directly
      return this.$store.state.heroesImageCache.result.heroes.find(function (item) {
        return item.id === heroID
      }).imgURL + '_sb.png'
    },
    getPerformance (match, heroID) {
      return match.details.players.find(function (item) {
        return item.hero_id === heroID
      })
    }
  }
}
