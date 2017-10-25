<template lang="html">
<transition tag="div">
  <div class="teamPanel">
    <div class="team_title" :class="isRadiant?radiant:dire"><b>{{this.getTitle}}</b></div>
    <div class="row row_title">
      <div class="avatar">玩家</div>
      <div class="hero">英雄</div>
      <div class="kda">KDA</div>
      <div class="engage">
        <div class="engage-percent">参战率</div>
        <div class="engage-damage">伤害%</div>
      </div>
      <div class="damage">
        <div class="hero-damage">伤害</div>
        <div class="tower-damage">建筑伤害</div>
        <div class="hero-healing">英雄治疗</div>
      </div>
      <div class="eco">
        <div class="eco-last-hits">正/反补</div>
        <div class="eco-gold">金钱/分钟</div>
        <div class="eco-xp">经验/分钟</div>
      </div>
    </div>
    <div class="row" v-for="player in playersOnOurSide">
      <div class="avatar" :class="isRadiant?radiant:dire">
        <div class="avatar_name">{{player.displayName}}</div>
        <div><img class="avatar_img" :src="player.avatarURL" /></div>
      </div>
      <div class="hero">
        <div class="level">Lv.{{getStat(player, 'level')}}</div>
        <img class="hero_img" :src='getHeroImg(player.hero_id)'>
      </div>
      <div class="kda">
        <div class="kda_num">{{getPlayerKDA(player.account_id).kda}}</div>
        <div>{{getPlayerKDA(player.account_id).stat}}</div>
      </div>
      <div class="engage">
        <div class="engage-percent">{{getBattleRatio(player)}}</div>
        <div class="engage-damage">{{getDamageRatio(player)}}</div>
      </div>
      <div class="damage">
        <div class="hero-damage">{{getStat(player, 'hero_damage')}}</div>
        <div class="tower-damage">{{getStat(player, 'tower_damage')}}</div>
        <div class="hero-healing">{{getStat(player, 'hero_healing')}}</div>
      </div>
      <div class="eco">
        <div class="eco-last-hits">{{getStat(player, 'last_hits')}} / {{getStat(player, 'denies')}}</div>
        <div class="eco-gold">{{getStat(player, 'gold_per_min')}}</div>
        <div class="eco-xp">{{getStat(player, 'xp_per_min')}}</div>
      </div>
    </div>
  </div>
</transition>
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
  data () {
    return {
      isRadiant: !this.side,
      radiant: 'radiant',
      dire: 'dire'
    }
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
    },
    getPlayerKDA (accountID) {
      let performance = this.matchDetails.players.find(function (item) {
        return item.account_id === accountID
      })
      return {
        kda: ((performance.kills + performance.assists) / (performance.deaths === 0 ? 1 : performance.deaths)).toFixed(1),
        stat: `${performance.kills} / ${performance.deaths} / ${performance.assists}`
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  $radiant-color: #a9cf54
  $dire-color: #c23c2a

  @media (min-width: 600px)
    .teamPanel
      margin: 20px 0

      .radiant
        color: $radiant-color

      .avatar_img
        border: 2px solid $radiant-color

      .dire
        color: $dire-color

      .avatar_img
        border: 2px solid $dire-color

    .row
      width: 100%
      line-height: 14px
      display: flex
      padding: 5px 15px
      color: #ccc

      &:nth-child(odd)
        background: rgb(30, 30, 30)

      &:nth-child(even)
        background: rgb(53, 53, 53)

    .row_title
      background: #0f0f0f !important
      padding: 15px

    .avatar
      flex: 0 1 80px

    .avatar_name
      width: 80px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

    .hero
      flex: 0 1 80px

    .hero_img
      padding-top: 2px

    .kda
      flex: 0 1 80px
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center

    .engage
      flex: 1 1 80px
      display: flex
      align-items: center

    .engage-percent
      flex: 1 0 40px

    .engage-damage
      flex: 1 0 40px

    .damage
      flex: 1 1 120px
      display: flex
      align-items: center

    .hero-damage
      flex: 1 1 80px

    .tower-damage
      flex: 1 1 80px

    .hero-healing
      flex: 1 1 80px

    .eco
      flex: 1 1 140px
      display: flex
      align-items: center

    .eco-last-hits
      flex: 1 1 80px

    .eco-gold
      flex: 1 1 80px

    .eco-xp
      flex: 1 1 80px

  @media (max-width: 599px)
    .teamPanel
      width: 100%
      font-size: 12px

    .row
      display: flex
      justify-content: space-between

    .row_title
      display: none

    .team_title.radiant
      background-color: $radiant-color

    .team_title.dire
      background-color: $dire-color

    .avatar_name
      width: 60px
      overflow: hidden
      text-overflow: ellipsis

    .kda
      order: 8
      display: flex
      flex-direction: column
      align-items: flex-end
      justify-content: flex-end

    .kda_num::before
      content: "kda:"

    .engage
      display: flex
      flex-direction: column
      justify-content: flex-end

    .engage-percent
      content: "参战率"

    .engage-damage::before
      content: "伤害"

    .hero
      order: 9
      display: flex
      align-items: flex-end

      .level
        position: relative
        left: 45px
        color: #FFF
        font-weight: bold
        font-style: italic

    .damage
      display: none

    .eco
      display: none

  .avatar_img
      border-radius: 32px
</style>
