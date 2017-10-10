<template>
  <div id='recent_games_list'>
    <div id="sub_title">最近比赛</div>
    <div id='list_body'>
      <div class='tr' id="th_title">
        <div class='col_hero'>英雄</div>
        <div class='col_match_id'>比赛ID</div>
        <div class='col_win'>结果</div>
        <div class='col_kda'>KDA(K/D/A)</div>
      </div>
      <transition-group name='fade'>
        <div class='tr' v-if='detailsFlag' v-for='(match, index) in matches' :key='match.match_id' @click='showBriefing(index)'>
          <div class='col_hero'>
            <img :src='getMyHeroImg(match)'>
            <span class='hero_name'>{{getMyHeroName(match)}}</span>
          </div>
          <div class='col_match_id'>{{match.match_id}}</div>
          <div class='col_win' :class='getWin(match)'>{{getWin(match)}}</div>
          <div class='col_kda'>{{getKDA(match)}}</div>
          <briefing-panel v-if='match.showBriefing' :itemsImageCache='itemsImageCache' :account_id='account_id' :matchDetails='match.details'></briefing-panel>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
// sb.png: 59x33px small horizontal portrait
// lg.png: 205x105px large horizontal portrait
// full.png: 256x144px full-quality horizontal portrait
// vert.jpg: 235x272px full-quality vertical portrait (note that this is a .jpg)
import axios from 'axios'
import Vue from 'vue'
import BriefingPanel from './BriefingPanel'

const RecentGamesCount = 10

export default {
  name: 'RecentGames',
  props: {
    account_id: Number,
    hasBriefing: Boolean
  },
  data () {
    return {
      detailsFlag: false,
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
          // be careful! Remember the declartive property of Vue
          Vue.set(this.matches[i], 'details', val[i])
          Vue.set(this.matches[i], 'showBriefing', false)
        }
        this.detailsFlag = true
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
    },
    getWin (match) {
      let myHeroID = this.getMyHeroID(match)
      let myPerformance = match.details.players.find(function (item) {
        return item.hero_id === myHeroID
      })
      // see player_slot field explanation
      if ((myPerformance.player_slot < 128 && match.details.radiant_win) ||
          (myPerformance.player_slot >= 128 && !match.details.radiant_win)) {
        return 'win'
      } else {
        return 'lose'
      }
    },
    getKDA (match) {
      let myHeroID = this.getMyHeroID(match)
      let myPerformance = match.details.players.find(function (item) {
        return item.hero_id === myHeroID
      })
      let kda = ((myPerformance.kills + myPerformance.assists) / (myPerformance.deaths === 0 ? 1 : myPerformance.deaths)).toFixed(1)
      return `${kda} (${myPerformance.kills} / ${myPerformance.deaths} / ${myPerformance.assists})`
    },
    showBriefing (index) {
      this.matches[index].showBriefing = !this.matches[index].showBriefing
    }
  },
  components: {
    BriefingPanel
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>
  @media (min-width: 800px)
    #recent_games_list
      width: 600px
      margin: 0 auto
      color: #fff
      font-size: 12px

    #list_body
      box-shadow: 0 0 1px 1px #000

    #sub_title
      color: #000

    #th_title
      font-weight: bold

    .tr:nth-child(odd)
      background: #212121

    .tr:nth-child(even)
      background: #1a1a1a

    .col_hero
      display: flex
      align-items: center
      flex-basis: 150px

    .col_match_id
      flex-basis: 150px

    .col_win
      flex-basis: 50px

    .col_kda
      flex-basis: 150px



  @media (max-width: 799px)
    #recent_games_list
      width: 100%
      font-size: 12px

    #th_title
      display: none

    .tr
      border-top: 1px solid #ccc

    .col_hero
      display: flex
      flex-basis: 150px
      align-items: center

    .col_match_id
      display: none

    .col_win
      flex-basis: 50px

    .col_kda
      display: flex
      justify-content: flex-end
      flex-basis: 150px


  #sub_title
    margin: 0 0 5px 20px
    font-size: 16px
    font-weight: bold

  .tr
    display: flex
    flex-wrap: wrap
    align-items: center
    justify-content: space-between
    padding: 5px

  .hero_name
    margin-left: 5px

  .win
    color: #499249

  .lose
    color: #c23c2a

  .fade-enter-active, .fade-leave-active
    transition: all 0.2s

  .fade-enter, .fade-leave-to
    transform: translateY(30px)
    opacity: 0


</style>
