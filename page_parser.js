var request = require("request");
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;
var Promise = require('promise');

var PageParser = function (url) {
    this.url = url;
};

PageParser.prototype.setPageData = function(data){
    this.pageData = data;
};

PageParser.prototype.getPageData = function () {
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

                resolve(this.setPageData(film));
            }
            else {
                reject(console.log("ERROR! : " + error));
            }
        }.bind(this));
    }.bind(this));
};

PageParser.prototype.isExist = function (_dbData, _name) {
    if(_dbData.length){
        for(var i = 0; i < _dbData.length; i++){
            if(_dbData[i].name == _name){
                return true;
            }
        }
    }

    return false;
};

PageParser.prototype.addToDb = function (_name, _poster, _season, _series) {
    MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
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
    });
};

module.exports = PageParser;