var request = require('request');
var imageCache = require('./imageCache.js');

exports.request = function (expressApp) {

  const APIKEY = 'CC25B9E21121B43715FB1C43DF64DCE6'
  const ACCOUNT_ID = '86782354'
  const LANG = 'zh_cn'
  const STEAM_MATCH_HISTORY_API_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001'

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

  expressApp.get('/get_image_cache', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(images, null, 2))
  });

  expressApp.get('/get_match_history', (req, res) => {
    let requestObj = assembleQueryObj('GET', STEAM_MATCH_HISTORY_API_URL, req.query)
    request(requestObj).pipe(res);
  })
}
