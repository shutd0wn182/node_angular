var request = require("request");
var cheerio = require("cheerio");
var cron = require('node-cron');
var Promise = require('promise');
var Films = require('./models/film.model.js');
var Shedules = require('./models/shedule.model.js');
var nodemailer = require('nodemailer');

// var urlDB = "postgres://iwsgbhihwkrmxn:0FpUatSuvlc_u4iE_ERk0gGm7I@ec2-54-243-201-144.compute-1.amazonaws.com:5432/d6t02bvudsqu1n";

var transporter = nodemailer.createTransport('smtps://masterrandrew%40gmail.com:Blink182182@smtp.gmail.com');

var PageParser = function (_url, _userEmail) {
    this.url = _url;
    this.userEmail = _userEmail;
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
                var $infoBlock = $('.item-info').find('tr').eq(2).find('td').last().text();

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
    console.log('adding to DB...');
    console.log('URL : ', this.url);
    console.log('EMAIL : ', this.userEmail);
    var userEmail = this.userEmail;

    var films = new Films({
        name : _name,
        poster : _poster,
        season : _season,
        series : _series,
        user_email : userEmail
    });

    films.save(function (error) {
        if(!error){
            console.log('add query finished');
        }
        else{
            console.error('error', error);
        }
    });

    var shedules = new Shedules({
        film_url : this.url
    });

    shedules.save(function (error) {
        if(!error){
            console.log('new shedule saved!');
        }
        else{
            console.error('error ', error);
        }
    });
};

PageParser.prototype.setCronJob = function () {
    this.cronJob = cron.schedule('0 */1 * * * *', function() {
        var pageData;

        console.log('=== new CRON job start... ===');

        this.getPageInfo().then(function () {
            pageData = this.getPageData();
            console.log('pageData.series - ', pageData.series);

            this.checkDbValue(pageData.name, pageData.series, this.userEmail);
        }.bind(this));
    }.bind(this), false);

    this.cronJob.start();
};

PageParser.prototype.checkDbValue = function (_name, _series, _user_email) {
    var query = Films.find();
    console.log('checking value in db..');

    query.run({},function(err, posts){
        if(!err){
            for(var i = 0; i < posts.length; i++){
                if(posts[i].name == _name && posts[i].series != _series && posts[i].user_email == _user_email){
                    console.log('Update new series!');

                    var mailOptions = {
                        from: '"WatchHelperApp" <nodemail@tester.com>',
                        to: _user_email,
                        subject: 'New Series',
                        text: 'There is no new series yet',
                        html: '<b>Hello world </b>'
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                }
                else{
                    console.log('nothing new');
                }
            }
        }
    });
};

module.exports = PageParser;