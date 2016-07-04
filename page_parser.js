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
                        Number($infoBlock.split('серия')[1]),
                    user_email : this.userEmail,
                    is_ended : $infoBlock.split('серия')[1].indexOf('(финал)') > -1
                };
                
                resolve(this.setPageData(film));
            }
            else {
                reject(console.log("ERROR! : " + error));
            }
        }.bind(this));
    }.bind(this));
};

PageParser.prototype.isExist = function (_dbData, _name, _email) {
    if(_dbData.length){
        for(var i = 0; i < _dbData.length; i++){
            if(_dbData[i].name == _name && _dbData[i].user_email == _email){
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
        user_email : userEmail,
        new_series : 0
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
    this.cronJob = cron.schedule('0 */5 * * * *', function() {
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
    console.log('checking value in db..');

    Films.findOne({
        where : {
            name : _name,
            user_email : _user_email,
            series : {
                ne : _series
            }
        }
    },function (err, film) {
        if(!err){
            this.updateSeriesCount(film.id, film.series-_series);
            this.sendMail(film.series-_series, _user_email);
        }
        else{
            console.error('ERROR checkDbValue', err);
        }
    }.bind(this));
};

PageParser.prototype.updateSeriesCount = function (_id, _series_count) {
    Films.update({
        where : {
            id : _id
        }
    }, {
        new_series : _series_count
    }, function (err) {
        if(err){
            console.error('Error in update');
        }

        console.log('New series are successfully updated');
    });
};

PageParser.prototype.sendMail = function (_series_count, _user_email) {
    var mailOptions = {
        from: '"WatchHelperApp" <nodemail@tester.com>',
        to: _user_email,
        subject: 'New Series',
        text: 'There is '+_series_count+' new series!',
        html: '<b>Check your app</b>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
};

module.exports = PageParser;