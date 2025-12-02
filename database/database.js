const mongoose = require("mongoose");

const connection = process.env.database;
const dbName = process.env.dbName;

mongoose
  .connect(connection, {
    dbName: dbName,
  })
  .then(() => {
    console.log("MongoDB connected successfully to edubuddy database");
  })
  .catch((error) => console.log("An Error has occurred", error));

module.exports = connection;
