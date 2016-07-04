schema = require('../config/caminte.config');

var Auth = schema.define('auth', {
    email:   {type: schema.Varchar},
    value:   {type: schema.Varchar},
    expires:    {type: schema.Integer}
});

module.exports = Auth;