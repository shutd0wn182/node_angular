var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

var url = 'http://fs.to/video/serials/i1JCtyIbttxmbahuYuAcA1i-flesh.html';

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        var lastWatchedMov;
        var poster = $('.poster-main img').attr('src');
        var lastMov = $('.m-item-info-td_type-short').eq(2).text().split('серия')[1];

        console.log("lastMov " + lastMov);
    } else {
        console.log("ERROR! : " + error);
    }
});

app.get('/', function (req, res) {
    res.send('fff');
});

app.post('/getlink/token=myapp', function (req, res) {
    console.log('req', req.body.name);
    res.send(req.body.name);

});

app.listen(3000, function () {});

// $.ajax({url:'test/', type:'POST', data:'Blink182', success : function(response){console.log('response', response)}});