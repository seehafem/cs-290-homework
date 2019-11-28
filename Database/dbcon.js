var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_seehafem',
  password        : '2398',
  database        : 'cs290_seehafem'
});

module.exports.pool = pool;
