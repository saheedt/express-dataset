const DataStore = require("nedb-promises");
const db = DataStore.create({
  filename: './datafile.db',
  autoload: true
});

module.exports = db;
