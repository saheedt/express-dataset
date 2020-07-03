const DataStore = require('nedb');
const db = new DataStore({
  filename: './datafile.db',
  autoload: true
});

module.exports = db;
