const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  auth: {
    authSource: "admin",
  },
  user: "root",
  pass: "mongo",
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

mongoose.Promise = global.Promise;

module.exports = mongoose;
