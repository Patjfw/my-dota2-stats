<template lang="html">
  <div class="teamPanel">
    <div class="team_title">{{this.getTitle}}</div>
    <div v-for="player in playersOnOurSide">
      <div class="avatar">
        <div>{{player.displayName}}</div>
        <div><img :src="player.avatarURL" /></div>
      </div>
      <div>
        <img :src='getHeroImg(player.hero_id)'>
        <div>{{getStat(player, 'level')}}</div>
      </div>
      <div>
        <div>{{getBattleRatio(player)}}</div>
        <div>{{getDamageRatio(player)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetch } from './mixins/fetch'
import { detailsFetch } from './mixins/detailsFetch'

const ANONYMOUS_AVATAR_URL = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'
const ANONYMOUS_USERNAME = '匿名玩家'

export default {
  name: 'TeamStats',
  mixins: [fetch, detailsFetch],
  props: {
    side: Number,
    matchDetails: Object,
    playersInfo: Array
  },
  computed: {
    playersOnOurSide () {
      let playersGroup = []
      for (let player of this.matchDetails.players) {
        if ((this.side === 0 && player.player_slot < 128) ||
            (this.side === 1 && player.player_slot >= 128)) {
          playersGroup.push(player)
        }
      }

      for (let player of playersGroup) {
        let avatarInfo = this.playersInfo.find(item => {
          return player.account_id === item.steamID32
        })
        if (!avatarInfo) {
          player.displayName = ANONYMOUS_USERNAME
          player.avatarURL = ANONYMOUS_AVATAR_URL
        } else {
          player.displayName = avatarInfo.personaname
          player.avatarURL = avatarInfo.avatar
        }
      }

      return playersGroup
    },
    getTitle () {
      let win = (this.matchDetails.radiant_win ^ this.side) ? '(胜利)' : ''
      return (this.side ? '夜魇' : '天辉') + win
    },
    getTeamKills () {
      return this.getSideStat(this.matchDetails, this.side, 'kills')
    },
    getTeamDamages () {
      return this.getSideStat(this.matchDetails, this.side, 'hero_damage')
    }
  },
  methods: {
    getBattleRatio (playerStat) {
      return ((playerStat.kills + playerStat.assists) / this.getTeamKills * 100).toFixed(1) + '%'
    },
    getDamageRatio (playerStat) {
      return (playerStat.hero_damage / this.getTeamDamages * 100).toFixed(1) + '%'
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
