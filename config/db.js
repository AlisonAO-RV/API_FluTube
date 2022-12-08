const config = require("../knexfile");
const knex = require("knex")(config.production);

module.exports = knex;
