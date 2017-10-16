<template lang="html">
  <transition tag="div">
    <div v-if="loaded" id="details_container">
      <div id="match_title">
        <span>比赛</span><span>{{$route.params.match_id}}</span>
        <p>{{getWin()}}</p>
      </div>
      <table id="time_stats">
        <tr>
          <th>结束时间</th>
          <th>比赛时长</th>
          <th>一血时间</th>
        </tr>
        <tr>
          <td>{{getStat(this.matchDetails, 'start_time')}}</td>
          <td>{{getStat(this.matchDetails, 'duration')}}分钟</td>
          <td>{{getStat(this.matchDetails, 'first_blood_time')}}</td>
        </tr>
      </table>
      <team-stats :matchDetails='matchDetails' :sides='0'></team-stats>
      <team-stats :matchDetails='matchDetails' :sides='1'></team-stats>
    </div>
  </transition>
</template>

<script>
  import { fetch } from './mixins/fetch'
  import { detailsFetch } from './mixins/detailsFetch'
  import TeamStats from './TeamStats'

  export default {
    name: 'GameDetails',
    mixins: [fetch, detailsFetch],
    data () {
      return {
        loaded: false,
        matchDetails: null,
        heroesImageCache: null,
        itemsImageCache: null,
        match_id: this.$route.params.match_id
      }
    },
    created () {
      if (this.$store.state.matches.length) {
        this.heroesImageCache = this.$store.state.heroesImageCache
        this.itemsImageCache = this.$store.state.itemsImageCache
        this.matchDetails = this.$store.state.matches.find((match) => {
          return match.match_id === parseInt(this.match_id)
        }).details
        this.loaded = true
      } else {
        let resources = Promise.all([this.getImgCache(), this.getMatchDetails(this.match_id)])
        resources.then(val => {
          this.heroesImageCache = this.$store.state.heroesImageCache = val[0].heroesImageCache
          this.itemsImageCache = this.$store.state.itemsImageCache = val[0].itemsImageCache

          this.matchDetails = val[1]
          this.loaded = true
        })
      }
    },
    methods: {
      getWin () {
        return this.matchDetails.radiant_win ? '天辉胜利' : '夜魇胜利'
      }
    },
    components: {
      TeamStats
    }
  }
</script>

<style lang="sass" scoped>
  @media (min-width: 800px)
    #details_container
      width: 800px
      margin: 0 auto

  @media (max-width: 360px)
    #details_container
      width: 360px

</style>
