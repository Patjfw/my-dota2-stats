var request = require('request');

exports.request = function (expressApp) {

  const APIKEY = 'CC25B9E21121B43715FB1C43DF64DCE6'
  const STEAM_API_URL = 'https://api.steampowered.com/IDOTA2Match_570'
  const MATCH_HISTORY = '/GetMatchHistory/V001'

  expressApp.get('/match_history', (req, res) => {
    request('https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=CC25B9E21121B43715FB1C43DF64DCE6').pipe(res);
  })
}
