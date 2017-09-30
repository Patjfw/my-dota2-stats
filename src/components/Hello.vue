<template>
  <div class="hello">
    <p @click='request'>test</p>
    <div v-for='hero_id in heroes'>
      <img :src='getHeroImg(hero_id)'>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
      imageCache: null,
      heroes: []
    }
  },
  created () {
    axios.get('/get_image_cache', {
    }).then((res) => {
      this.imageCache = res.data
    })
  },
  methods: {
    request: function () {
      axios.get('/get_match_history', {
      }).then((res) => {
        this.heroes.push(res.data.result.matches[0].players[7].hero_id)
      })
    },
    getHeroImg: function (heroId) {
      // the result returned is unsorted, and missing some index, so can't use index directly
      return this.imageCache.result.heroes.find(function (item) { return item.id === heroId }).imgURL + '_sb.png'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
