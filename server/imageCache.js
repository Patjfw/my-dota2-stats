var fs = require('fs');

var request = require('request-promise');

exports.checkCache = function () {

  const APIKEY = 'CC25B9E21121B43715FB1C43DF64DCE6'
  const LANG = 'zh_cn'
  const STEAM_HERO_API_URL = 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001/'
  const HERO_IMG_URL = 'http://cdn.dota2.com/apps/dota2/images/heroes/'

  if(fs.existsSync('heroImage.json')){
    let rawdata = fs.readFileSync('heroImage.json');
    let heroImageObj = JSON.parse(rawdata);

    return heroImageObj
  }else{
    let heroImageQueryOpt = {
      method: 'GET',
      uri: STEAM_HERO_API_URL,
      qs: {
        key: APIKEY,
        language: LANG
      },
      json: true
    }

    request(heroImageQueryOpt)
      .then(function(res){
        for(let item of res.result.heroes){
          //npc_dota_hero_realname, get the realName
          item.imgURL = HERO_IMG_URL + item.name.substring(14)
        }
        let data = JSON.stringify(res, null, 2);
        fs.writeFileSync('heroImage.json', data);

        return data
      })
      .catch(function(err){
        console.log('Hero Image request error')
      })
  }
}
