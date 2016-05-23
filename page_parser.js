var request = require("request");
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;
var cron = require('node-cron');
var Promise = require('promise');
var pg = require('pg');

var urlDB = "postgres://postgres:1111@localhost/films";
// var urlDB = "postgres://iwsgbhihwkrmxn:0FpUatSuvlc_u4iE_ERk0gGm7I@ec2-54-243-201-144.compute-1.amazonaws.com:5432/d6t02bvudsqu1n";

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
                    series : ($infoBlock.split('серия')[1].indexOf('(финал)') > -1) ? Number($infoBlock.split('серия')[1].split('(финал)')[0]) :
                        Number($infoBlock.split('серия')[1])
                };

console.log('film.series', film.series);
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
    pg.connect(urlDB, function(err, client, done) {
        console.log('adding to db..');

        client.query('INSERT INTO films (name, poster, season, series) VALUES ($1, $2, $3, $4)', [_name, _poster, _season, _series]);
    });
    // MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    //     var dbCollection = db.collection('trackDb');
    //
    //     dbCollection.insertOne({
    //         name : _name,
    //         poster : _poster,
    //         season : _season,
    //         series : _series
    //     });

        // dbCollection.find().toArray(function (err, results) {
        //     console.log('results', results);
        // });

        // dbCollection.count(function (err, count) {
        //     console.log('count', count);
        // });
    // });
};

PageParser.prototype.setCronJob = function () {
    this.cronJob = cron.schedule('0 */5 * * * *', function() {
        var pageData;

        console.log('=== new CRON job reached... ===');

        this.getPageInfo().then(function () {
            pageData = this.getPageData();
            console.log('pageData.series - ', pageData.series);

            this.checkDbValue(pageData.series);
        }.bind(this));
    }.bind(this), false);

    this.cronJob.start();
};

PageParser.prototype.checkDbValue = function (_series) {
    var results;
    console.log('checking value in db..');

    pg.connect(urlDB, function(err, client, done) {
        if(!err){
            client.query('SELECT (name, poster, season, series) AS name, poster, season, series FROM films', function (error, result) {
                if(!error){
                    results = result.rows;

                    for(var i = 0; i < results.length; i++){
                        if(results[i].series != _series){
                            console.log('UPdate new series!');
                        }
                        else{
                            console.log('nothing new...');
                        }
                    }
                }
            });
        }
    });
};

module.exports = PageParser;