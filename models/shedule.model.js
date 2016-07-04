/*
 caminte ORM for Postgres
 */
var schema = require('../config/caminte.config');

var Shedules = schema.define('shedules', {
    film_url:   {type: schema.Varchar},
    film_id:    {type: schema.Integer}
});

module.exports = Shedules;