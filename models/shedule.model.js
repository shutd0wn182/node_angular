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

var Shedules = schema.define('shedules', {
    film_url:   {type: schema.Varchar},
    film_id:    {type: schema.Integer}
});

module.exports = Shedules;