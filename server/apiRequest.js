var request = require('request');
var imageCache = require('./imageCache.js');

exports.request = function (expressApp) {

  const APIKEY = 'CC25B9E21121B43715FB1C43DF64DCE6'
  const ACCOUNT_ID = '86782354'
  const LANG = 'zh_cn'
  const STEAM_MATCH_HISTORY_API_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001'
  const STEAM_MATCH_DETAIL_API_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001'
  const STEAM_PLAYER_SUMMARIES_API_URL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002'

  let images;
  let imagesPromise = imageCache.checkCache()

  imagesPromise.then(function(vals){
    images = vals;
  })

  function assembleQueryObj(reqType='GET', url, params, useJSON=true){
    let query = Object.assign({
      key: APIKEY,
      language: LANG,
      account_id: ACCOUNT_ID
    }, params)
    return {
      method: reqType,
      uri: url,
      qs: query,
      json: useJSON
    }
  }

  // Convert Steam User ID(32) to Steam 64 ID
  function steamIDConvertion(steamUserID){

  }

  expressApp.get('/get_image_cache', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(images, null, 2))
  });

  expressApp.get('/get_match_history', (req, res) => {
    let requestObj = assembleQueryObj('GET', STEAM_MATCH_HISTORY_API_URL, req.query)
    request(requestObj).pipe(res);
  })

  expressApp.get('/get_match_detail', (req, res) => {
    let requestObj = assembleQueryObj('GET', STEAM_MATCH_DETAIL_API_URL, req.query)
    request(requestObj).pipe(res);
  })

  expressApp.get('/get_player_avatar', (req, res) => {
    console.log(req.query.steamids)
    request(requestObj).pipe(res);
  })
}
