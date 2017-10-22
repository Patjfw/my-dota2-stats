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
        case 'duration':
          return Math.floor(stats['duration'] / 60)
        case 'first_blood_time':
          return Math.floor(stats['first_blood_time'] / 60) + '分' + (stats['first_blood_time'] % 60) + '秒'
        case 'start_time':
          let secs = Math.floor((Date.now() / 1000) - stats['start_time'])
          if (secs < 60) {
            return secs + '秒前'
          } else if (secs < 3600) {
            return Math.floor(secs / 60) + '分前'
          } else if (secs < 86400) {
            return Math.floor(secs / 3600) + '小时前'
          } else {
            return Math.floor(secs / 86400) + '天前'
          }
        // the game_mode returns incorrect result
        // case 'game_mode':
        //   console.log(stats)
        //   return this.getGameMode(stats['game_mode'])
        default:
          return stats[propertyName]
      }
    },
    getSideStat (matchDetails, side, statName) {
      let count = 0
      for (let player of matchDetails.players) {
        if ((side === 0 && player.player_slot < 128) ||
            (side === 1 && player.player_slot >= 128)) {
          count += player[statName]
        }
      }
      return count
    }
  }
}
