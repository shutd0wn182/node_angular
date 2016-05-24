/*inject modules*/
var express = require('express');
var bodyParser = require('body-parser');
var PageParser = require('./page_parser.js');
var Films = require('./models/film.model.js');
var Shedules = require('./models/shedule.model.js');

var cors = require('cors');

/*init ExApp*/
var app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

/*use parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var dbResults = [];
// var urlDB = "postgres://iwsgbhihwkrmxn:0FpUatSuvlc_u4iE_ERk0gGm7I@ec2-54-243-201-144.compute-1.amazonaws.com:5432/d6t02bvudsqu1n";

/*get films from model*/
var query = Films.find();

query.run({},function(err, posts){
    if(!err){
        dbResults = posts;
    }
});

app.get('/', function (req, res) {
    res.send('index page');
});

/*API*/
app.post('/getfilms/token=myapp', function (req, res) {
    console.log('dbResults = ', dbResults);
    res.send(dbResults);
});

app.post('/addfilm/token=myapp', function (req, res) {
    var pageData;
    var pageParserObj = new PageParser(req.body.filmUrl);

    pageParserObj.getPageInfo().then(function () {
        pageData = pageParserObj.getPageData();
        if(!pageParserObj.isExist(dbResults, pageData.name)){
            console.log('pageData', pageData);
            pageParserObj.setCronJob();

            pageParserObj.addToDb(pageData.name, pageData.poster, pageData.season, pageData.series);

            dbResults.push(pageData);

            res.send(dbResults);
        }
        else{
            console.error('Error ,value allready exist in DB');
        }
    });
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});