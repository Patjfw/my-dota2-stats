import axios from 'axios'

export const fetch = {
  methods: {
    getImgCache () {
      return new Promise(function (resolve, reject) {
        axios.get('/get_image_cache', {
        }).then((res) => {
          resolve(res.data)
        })
      })
    },
    getRecentMatches (matchesCount) {
      return new Promise(function (resolve, reject) {
        axios.get('/get_match_history', {
          params: {
            matches_requested: matchesCount
          }
        }).then((res) => {
          resolve(res.data.result.matches)
        })
      })
    },
    getMatchDetails (matchID) {
      return new Promise(function (resolve, reject) {
        axios.get('/get_match_detail', {
          params: {
            match_id: matchID
          }
        }).then((res) => {
          resolve(res.data.result)
        })
      })
    },
    getPlayerAvatar (steamIDs) {
      return new Promise(function (resolve, reject) {
        axios.get('/get_player_avatar', {
          params: {
            steamids: steamIDs
          }
        }).then((res) => {
          resolve(res.data.result)
        })
      })
    },
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
    },
    getKDA (match) {
      let myHeroID = this.getHeroID(match, this.account_id)
      let myPerformance = this.getPerformance(match, myHeroID)
      let kda = ((myPerformance.kills + myPerformance.assists) / (myPerformance.deaths === 0 ? 1 : myPerformance.deaths)).toFixed(1)
      return {
        'kda': kda,
        'kills': myPerformance.kills,
        'deaths': myPerformance.deaths,
        'assists': myPerformance.assists
      }
    }
  }
}
