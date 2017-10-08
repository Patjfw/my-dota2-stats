<template>
  <div class="hello">
    <div v-for='match in matches'>
      <img :src='getMyHeroImg(match)'>
      <span>{{getMyHeroName(match)}}</span>
      <span>{{match.match_id}}</span>
      <!-- <span>{{match.details.radiant_win}}</span> -->
    </div>
    <!-- <img src='http://cdn.dota2.com/apps/dota2/images/abilities/zuus_arc_lightning_lg.png' /> -->
  </div>
</template>

<script>
// sb.png: 59x33px small horizontal portrait
// lg.png: 205x105px large horizontal portrait
// full.png: 256x144px full-quality horizontal portrait
// vert.jpg: 235x272px full-quality vertical portrait (note that this is a .jpg)
import axios from 'axios'

const RecentGamesCount = 10

export default {
  name: 'RecentGames',
  props: {
    account_id: Number
  },
  data () {
    return {
      heroesImageCache: null,
      itemsImageCache: null,
      matches: []
    }
  },
  mounted () {
    let extraSourceLoadPromise = Promise.all([this.getImgCache(), this.getRecentMatches()])
    extraSourceLoadPromise.then(val => {
      this.heroesImageCache = val[0].heroesImageCache
      this.itemsImageCache = val[0].itemsImageCache
      this.matches = val[1]

      // this.showRecentMatchesList(this.matches)
      this.getMatchDetails()
    })
  },
  methods: {
    getImgCache () {
      return new Promise(function (resolve, reject) {
        axios.get('/get_image_cache', {
        }).then((res) => {
          resolve(res.data)
        })
      })
    },
    getRecentMatches () {
      return new Promise(function (resolve, reject) {
        axios.get('/get_match_history', {
          params: {
            matches_requested: RecentGamesCount
          }
        }).then((res) => {
          resolve(res.data.result.matches)
        })
      })
    },
    getMatchDetails () {
      let matchesPromiseArr = []
      for (let match of this.matches) {
        matchesPromiseArr.push(new Promise(function (resolve, reject) {
          axios.get('/get_match_detail', {
            params: {
              match_id: match.match_id
            }
          }).then((res) => {
            resolve(res.data.result)
          })
        }))
      }

      let allMatchesPromise = Promise.all(matchesPromiseArr)
      allMatchesPromise.then((val) => {
        for (let i = 0; i < this.matches.length; i++) {
          this.matches[i].details = val[i]
        }
        console.log(this.matches)
      })
    },
    getMyHeroID (match) {
      return match.players.find((item) => {
        return item.account_id === this.account_id
      }).hero_id
    },
    getHeroImg (heroID) {
      // the result returned is unsorted, and missing some index, so can't use index directly
      return this.heroesImageCache.result.heroes.find(function (item) {
        return item.id === heroID
      }).imgURL + '_sb.png'
    },
    getMyHeroImg (match) {
      let myHeroID = this.getMyHeroID(match)
      return this.getHeroImg(myHeroID)
    },
    getHeroName (heroID) {
      return this.heroesImageCache.result.heroes.find(function (item) {
        return item.id === heroID
      }).localized_name
    },
    getMyHeroName (match) {
      let myHeroID = this.getMyHeroID(match)
      return this.getHeroName(myHeroID)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
