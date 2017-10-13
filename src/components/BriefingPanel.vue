<template>
  <div class="briefing_container">
    <div class='briefing_panel'>
      <div class='eco'>
        <div class='gold_income'>总经济：{{getStat(stats, 'gold')}}</div>
        <div class='gpm'>每分钟金钱：{{getStat(stats, 'gold_per_min')}}</div>
        <div class='xpm'>每分钟经验：{{getStat(stats, 'xp_per_min')}}</div>
        <div class='last_hits'>正补：{{getStat(stats, 'last_hits')}}</div>
        <div class='denies'>反补：{{getStat(stats, 'denies')}}</div>
      </div>
      <div class='damage'>
        <div class="hero_damage">英雄伤害：{{getStat(stats, 'hero_damage')}}</div>
        <div class='build_damage'>建筑伤害：{{getStat(stats, 'tower_damage')}}</div>
        <div class='heal'>英雄治疗：{{getStat(stats, 'hero_healing')}}</div>
      </div>
      <ul class='items'>
        <li class='item_li' v-for='item in getItems(stats)'>
          <img class='item_img' :src='item.imgSrc' :title='item.localized_name'/>
        </li>
      </ul>
    </div>
    <div class="details_link">
      <a href='#/gameDetails'>查看比赛详情 >></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BriefingPanel',
    props: {
      account_id: Number,
      itemsImageCache: Object,
      matchDetails: Object
    },
    data () {
      return {
        stats: null
      }
    },
    created () {
      this.stats = this.getMyStats(this.matchDetails)
    },
    methods: {
      getMyStats (matchDetails) {
        return matchDetails.players.find((item) => {
          return item.account_id === this.account_id
        })
      },
      getItems (stats) {
        let items = []
        for (let i = 0; i < 6; i++) {
          let itemID = stats['item_' + i]
          let item = this.itemsImageCache.result.items.find(function (item) {
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
</script>

<style lang='sass' scoped>
  @media (max-width: 360px)
    .briefing_panel
      width: 100%
      margin-top: 10px
      display: flex
      justify-content: center
      flex-wrap: wrap

    .eco
      flex: 0 1 150px

    .damage
      flex: 0 1 150px

    .items
      flex: 0 0 auto

    .item_li
      display: inline

    .item_img
      margin: 2px
      width: 36px
      height: 27px

  @media (min-width: 361px)
    .eco
      flex: 1 0 100px

    .damage
      flex: 2 0 100px

    .items
      flex: 0 0 160px

    .item_li
      display: inline

    .item_img
      margin: 2px
      width: 48px
      height: 36px

  .briefing_container
    width: 100%

  .briefing_panel
    width: 100%
    margin-top: 10px
    display: flex
    wrap: wrap



  .details_link
    float: right


</style>
