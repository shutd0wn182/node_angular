var caminte = require('caminte'),
    Schema = caminte.Schema,
// config = {
//     driver     : "postgres",
//     host       : "localhost",
//     port       : "5432",
//     username   : "postgres",
//     password   : "1111",
//     database   : "films",
//     pool       : true
// };

    config = {
            driver     : "postgres",
            host       : "ec2-54-243-201-144.compute-1.amazonaws.com",
            port       : "5432",
            username   : "iwsgbhihwkrmxn",
            password   : "0FpUatSuvlc_u4iE_ERk0gGm7I",
            database   : "d6t02bvudsqu1n",
            pool       : true,
            ssl        : true
    };

var schema = new Schema(config.driver, config);

module.exports = schema;