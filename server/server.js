var express = require('express')
var path = require('path')
var apiRequest = require('../server/apiRequest.js')

var port = 3000
var app = express()

var server = app.listen(port)
app.use(express.static('../dist'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/../dist/index.html'))
})


apiRequest.request(app);
