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
        console.log(res.data.result.matches[0].players[7].hero_id)
        this.heroes.push(res.data.result.matches[0].players[7].hero_id)
      })
    },
    getHeroImg: function (heroId) {
      console.log(this.imageCache)
      return this.imageCache.result.heroes[heroId - 1].imgURL + '_sb.png'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
