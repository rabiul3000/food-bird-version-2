const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();


const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = client;
