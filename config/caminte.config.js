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

module.exports = schema;