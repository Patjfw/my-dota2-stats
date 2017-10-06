var fs = require('fs');

var request = require('request-promise');

exports.checkCache =  function () {
  return new Promise(function(resolve, reject){
    const APIKEY = 'CC25B9E21121B43715FB1C43DF64DCE6'
    const LANG = 'zh_cn'

    const STEAM_HEROES_API_URL = 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001/'
    const STEAM_ITEMS_API_URL = 'https://api.steampowered.com/IEconDOTA2_570/GetGameItems/V001/'

    const HEROERS_IMG_URL = 'http://cdn.dota2.com/apps/dota2/images/heroes/'
    const ITEMS_IMG_URL = 'http://cdn.dota2.com/apps/dota2/images/items/'

    let heroesImageCacheParam = {
      cacheFileName : 'heroesImage.json',
      imgURL : HEROERS_IMG_URL,
      handler : heroesImageHandler,
      params:{
        method: 'GET',
        uri: STEAM_HEROES_API_URL,
        qs: {
          key: APIKEY,
          language: LANG
        },
        json: true
      }
    }

    let itemsImageCacheParam = {
      cacheFileName : 'itemsImage.json',
      imgURL : ITEMS_IMG_URL,
      handler : itemsImageHandler,
      params:{
        method: 'GET',
        uri: STEAM_ITEMS_API_URL,
        qs: {
          key: APIKEY,
          language: LANG
        },
        json: true
      }
    }

    function heroesImageHandler(json){
      for(let item of json.result.heroes){
        //npc_dota_hero_realname, get the realName
        item.imgURL = HEROERS_IMG_URL + item.name.substring(14)
      }

      let data = JSON.stringify(json, null, 2);
      fs.writeFileSync(heroesImageCacheParam.cacheFileName, data);
      return data
    }

    function itemsImageHandler(json){
      let data = JSON.stringify(json, null, 2);
      fs.writeFileSync(itemsImageCacheParam.cacheFileName, data);
      return data
    }

    function cacheSource(sourceParam){
      return new Promise(function(resolve, reject){
        if(fs.existsSync(sourceParam.cacheFileName)){
          let rawdata = fs.readFileSync(sourceParam.cacheFileName);
          let imageCacheObj = JSON.parse(rawdata);

          console.log('read from local file')
          //console.log(imageCacheObj)
          resolve(imageCacheObj)
        }else{
          console.log('request from remote')
          request(sourceParam.params)
          .then(function(res){
            let data = sourceParam.handler(res);
            // console.log(data)
            resolve(data)
          })
          .catch(function(err){
            console.log(sourceParam.cacheFileName + ' request error')
            reject(sourceParam.cacheFileName + ' request error')
          })
        }
      })
    }

    let cachePromise1 = cacheSource(heroesImageCacheParam);
    let cachePromise2 = cacheSource(itemsImageCacheParam);

    let allLoadedPromise = Promise.all([cachePromise1, cachePromise2]);
    allLoadedPromise.then(function(val){
      resolve( {
        heroesImageCache: val[0],
        itemsImageCache: val[1]
      })
    })
  })
}
