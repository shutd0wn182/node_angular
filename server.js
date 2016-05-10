/*inject modules*/
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var PageParser = require('./page_parser.js');

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

var dbResults = [];
var urlDB = 'mongodb://localhost:27017/test';
// var urlParse = 'http://fs.to/video/serials/i4qyEFAKeiRHiU7usAKGxqw-sotnya.html';
/*connect to DB*/

MongoClient.connect(urlDB, function(err, db) {
    var dbCollection = db.collection('trackDb');

    // db.collection('trackDb').remove({name:' Тёмное дитя '});

    dbCollection.find().toArray(function (err, results) {
        if(results.length) {
            dbResults = results;
        }
    });
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
            pageParserObj.addToDb(dbResults, pageData.name, pageData.poster, pageData.season, pageData.series);
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