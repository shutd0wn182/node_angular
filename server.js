/*inject modules*/
var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;

/*init ExApp*/
var app = express();

/*use parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

var urlDB = 'mongodb://localhost:27017/test';
var urlParse = 'http://fs.to/video/serials/i1JCtyIbttxmbahuYuAcA1i-flesh.html';

/*connect to DB*/
MongoClient.connect(urlDB, function(err, db) {
    if(err) throw err;
    var dbCollection = db.collection('parser_collection');
    // dbCollection.insert({name:'Andrew'}, function (err, docs) {
    //     dbCollection.count(function (err, count) {
    //         console.log('count', count);
    //     });
    //
    //     dbCollection.find().toArray(function (err, results) {
    //         console.log('results', results);
    //         db.close();
    //     });
    // });
    // console.log("Connected correctly to server.", db);
});

/*parse page*/
request(urlParse, function (error, response, body) {
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

/*API*/
app.post('/getlink/token=myapp', function (req, res) {
    console.log('req', req.body.name);
    res.send(req.body.name);

});

/*start web server on port 3000*/
app.listen(3000, function () {});

// $.ajax({url:'test/', type:'POST', data:'Blink182', success : function(response){console.log('response', response)}});