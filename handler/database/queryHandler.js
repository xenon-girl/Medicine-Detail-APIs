const util = require('util');

function queryHandler(connectionPool, query, params, callback) {

  if (typeof callback !== 'function') {
    console.log("Invalid callback type");
    return "Invalid callback type";
  }
  
  try {
    connectionPool.query(query, params,
      function (err, res, fields) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          console.log("Query Executed Succesfully!");
          callback(null, res);
        }
      });
  } catch (err) {
    callback(err, null);
  }

}

module.exports = util.promisify(queryHandler);