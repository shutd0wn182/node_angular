/*inject modules*/
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var PageParser = require('./page_parser.js');
var schedule = require('node-schedule');
var pg = require('pg');

/*init ExApp*/
var app = express();

/*use parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var cron;
var dbResults = [];
var urlDB = "postgres://postgres:1111@localhost/films";
/*connect to DB*/

/*
Mongo*/
/*
MongoClient.connect(urlDB, function(err, db) {
    var dbCollection = db.collection('trackDb');

    dbCollection.find().toArray(function (err, results) {
        if(results.length) {
            dbResults = results;
        }
    });
});
*/

/*
Postgres
*/
pg.connect(urlDB, function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    else{
        console.log("NICE!!!");

        client.query('SELECT (name) AS name FROM films', function (err, result) {
            console.log(result.rows);
        });
    }
});

app.get('/', function (req, res) {
    res.send('index page');
});

/*API*/
app.post('/getfilms/token=myapp', function (req, res) {
    res.send(dbResults);
});

app.post('/addfilm/token=myapp', function (req, res) {
    var pageData;
    var pageParserObj = new PageParser(req.body.filmUrl);

    pageParserObj.getPageInfo().then(function () {
        pageData = pageParserObj.getPageData();
        if(!pageParserObj.isExist(dbResults, pageData.name)){
            console.log('pageData', pageData);
            pageParserObj.addToDb(pageData.name, pageData.poster, pageData.season, pageData.series);


            /*CRON*/
            // cron = schedule.sheduleJob('* 3 * * * *', function () {
            //     pageParserObj.getPageInfo().then(function () {
            //         var newPageData = pageParserObj.getPageData();
            //         console.log('new cron job reached',  newPageData.series);
            //     });
            // });


            dbResults.push(pageData);
            res.send(dbResults);
        }
        else{
            console.error('Error ,value allready exist in DB');
        }
    });
});

/*start web server on port 3000*/
app.listen(3000, function () {});