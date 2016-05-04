/*inject modules*/
var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;
var Promise = require('promise');

/*init ExApp*/
var app = express();

/*use parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

var dbResults = [];
var urlDB = 'mongodb://localhost:27017/test';
var urlParse = 'http://fs.to/video/serials/i4EHRVP1MmJEfbPA1ekFH7G-tomnoje-ditya.html';
/*connect to DB*/

MongoClient.connect(urlDB, function(err, db) {
    // var dbCollection = db.collection('trackDb');

    // db.collection('trackDb').remove({name:' Тёмное дитя '})
    db.collection('trackDb').find().toArray(function (err, results) {
        if(results.length) {
            for (var i = 0; i < results.length; i++) {
                dbResults.push(results[i]);
            }
        }
    });
});

/*parse page*/

var PageParser = function (url) {
    this.url = url;
};

PageParser.prototype.setData = function(data){
    this.pageData = data;
};

PageParser.prototype.getData = function () {
    return this.pageData;
};

PageParser.prototype.getPageInfo = function () {
    return new Promise(function (resolve, reject) {
        request(this.url, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                var $infoBlock = $('.m-item-info-td_type-short').eq(2).text();

                var film = {
                    name : $('.b-tab-item__title-inner').children('span').text().replace(/\s\s+/g, ' '),
                    poster : $('.poster-main img').attr('src'),
                    season : Number($infoBlock.split('серия')[0].split('сезон')[1]),
                    series : Number($infoBlock.split('серия')[1])
                };

                resolve(this.setData(film));
            }
            else {
                reject(console.log("ERROR! : " + error));
            }
        }.bind(this));
    }.bind(this));
};

PageParser.prototype.isExist = function (_name) {
    if(dbResults.length){
        for(var i = 0; i < dbResults.length; i++){
            if(dbResults[i].name == _name){
                return true;
            }
        }
    }

    return false;
};

PageParser.prototype.addToDb = function (_name, _poster, _season, _series) {
    if(!this.isExist(_name)){
        MongoClient.connect(urlDB, function(err, db) {
            var dbCollection = db.collection('trackDb');

            console.log('adding to db..');

            dbCollection.insertOne({
                name : _name,
                poster : _poster,
                season : _season,
                series : _series
            });

            dbCollection.find().toArray(function (err, results) {
                console.log('results', results);
            });

            // dbCollection.count(function (err, count) {
            //     console.log('count', count);
            // });
            //

        });
    }
    else{
        console.error('Error ,value allready exist in DB');
    }
};

var pageData;
var pageParserObj = new PageParser(urlParse);

pageParserObj.getPageInfo().then(function (res) {
    var pageData = pageParserObj.getData();

    pageParserObj.addToDb(pageData.name, pageData.poster, pageData.season, pageData.series);
});

app.get('/', function (req, res) {
    res.send('index page');
});

/*API*/
app.post('/getlink/token=myapp', function (req, res) {
    console.log('req', req.body.name);
    res.send(req.body.name);

});

/*start web server on port 3000*/
app.listen(3000, function () {});