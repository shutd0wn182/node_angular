/*
 caminte ORM for Postgres
 */
var schema = require('../config/caminte.config');

var Films = schema.define('films', {
        name:        {type: schema.String},
        poster:      {type: schema.String},
        season:      {type: schema.Integer},
        series:      {type: schema.Integer},
        id :         {type: schema.Integer},
        user_email : {type : schema.String},
        new_series : {type : schema.String}
    });

module.exports = Films;