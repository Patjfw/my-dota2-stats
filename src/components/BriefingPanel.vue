<template>
  <div class='briefing_panel'>
    <div class='eco'>
      <div class='gpm'></div>
      <div class='xpm'></div>
    </div>
    <div class='damage'>
      <div class="hero_damage"></div>
      <div class='build_damage'></div>
      <div class='heal'></div>
    </div>
    <ul class='items'>
      <li v-for='item in getItems(stats)'>
        <img class='item_img' :src='item.imgSrc' />
      </li>
    </ul>
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
      }
    }
  }
</script>

<style lang='sass' scoped>
  .briefing_panel
    width: 100%
    display: flex

    .eco

    .damage

    .items
      align-items: flex-end
      display: flex
      flex-grow: none
      flex-basis: 200px

    .item_img
      width: 48px
      height: 36px

</style>
