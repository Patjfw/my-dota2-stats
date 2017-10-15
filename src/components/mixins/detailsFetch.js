export const detailsFetch = {
  methods: {
    getStats (matchDetails, accountID) {
      return matchDetails.players.find((item) => {
        return item.account_id === accountID
      })
    },
    getItems (stats) {
      let items = []
      for (let i = 0; i < 6; i++) {
        let itemID = stats['item_' + i]
        let item = this.$store.state.itemsImageCache.result.items.find(function (item) {
          return itemID === item.id
        })

        // it's possible that not full slots
        if (item) {
          items.push(item)
          item.imgSrc = 'http://cdn.dota2.com/apps/dota2/images/items/' + item.name.substring(5) + '_lg.png'
        }
      }
      return items
    },
    getStat (stats, propertyName) {
      switch (propertyName) {
        case 'gold':
          return stats['gold'] + stats['gold_spent']
        default:
          return stats[propertyName]
      }
    }
  }
}
