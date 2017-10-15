<template>
  <div id="app">
    <router-view></router-view>
    <div id="declartion">
      <p>说明：</p>
      <p>功能类似于DotaMax，显示最近十场比赛的统计数据。</p>
      <p>数据来源于Steam API，如果载入失败，那一定是V社服务器又抽风了</p>
    </div>
  </div>
</template>

<script>
  import store from './store'
  export default {
    name: 'app',
    store
  }
</script>

<style lang='sass'>
  *
    margin: 0
    padding: 0

  a
    text-decoration: none

    &:hover, &:link, &:visited
      color: red

  ul
    list-style: none

    li
      text-decoration: none

  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif

  #declartion
    width: 320px
    margin: 0 auto
    font-size: 12px

</style>
