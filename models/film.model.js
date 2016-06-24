/*
 caminte ORM for Postgres
 */

var caminte = require('caminte'),
    Schema = caminte.Schema,
    config = {
        driver     : "postgres",
        host       : "localhost",
        port       : "5432",
        username   : "postgres",
        password   : "1111",
        database   : "films",
        pool       : true
    };

var schema = new Schema(config.driver, config);

var Films = schema.define('films', {
        name:        {type: schema.String},
        poster:      {type: schema.String},
        season:      {type: schema.Integer},
        series:      {type: schema.Integer},
        id :         {type: schema.Integer},
        user_email : {type : schema.String}
    });

module.exports = Films;