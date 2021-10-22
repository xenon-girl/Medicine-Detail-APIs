const mysql = require('mysql');
const fs = require('fs')

function mySqlConnector() {

  this.connect = function (mySqlConfig, callback) {

    if (typeof callback !== 'function') {
      console.log("Invalid callback type");
      return "Invalid callback type";
    }

    const connection = mysql.createPool({
      host: mySqlConfig['url'],
      port: mySqlConfig['port'],
      user: mySqlConfig['user'],
      password: mySqlConfig['password'],
      database: mySqlConfig['database'],
      connectionLimit: mySqlConfig['connectionLimit'],
      maxPreparedStatements: 500,
      waitForConnections: true,
      queueLimit: 0
    });

    callback(null, connection);
  };
  
}

module.exports = mySqlConnector;