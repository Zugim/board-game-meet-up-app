require("dotenv").config({ path: "./.env.local" });

ENVIRONMENT = process.env.NODE_ENV || "development";
const config = require("../knexfile")[ENVIRONMENT];
const knex = require("knex")(config);

module.exports = knex;
