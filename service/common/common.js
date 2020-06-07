'use stirct';
var mysql = require('mysql');
var path = require("path");
/* global process */
module.exports = {
  insert:insert,
  inserts:inserts,
  rollback:rollback,
  getConnection:getConnection,
  getRanNum:getRanNum,
  transtime:transtime,
  uploadsGoodsPath: path.join(__dirname, '../public/images'),  // 上传的图片所放置的文件夹
  uploadsAvatarPath: path.join(__dirname, '../public/avatar_uploads'),  // 上传的头像所放置的文件夹
};

var config = {
  db: {
    database:"apartment",
    host:"127.0.0.1",
    user:'root',
    password:"123456",
    port:"3306"
  },
//链接数据库

};
var pool = mysql.createPool({
  host:config.db.host,
  database:config.db.database,
  user:config.db.user,
  password:config.db.password,
  post:3306
});
function transtime(date){
  var d = new Date(date);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}
/**
 * 随机生成字符串
 * @returns {string}
 */
function getRanNum() {
  var result = [];
  for (var i = 0; i < 12; i++) {
    var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
    //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
    result.push(String.fromCharCode(65 + ranNum));
  }
  return result.join('');
}
function getConnection (cb){
  if (typeof cb == "function") {
    pool.getConnection(function (err, connection) {
      cb(err, connection);
    });
  } else {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }
};

function insert( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
};

function inserts(sql,data,cb) {
  pool.getConnection(function (err,connection) {
    connection.query(sql,data,function (err,reslet) {
      if(err){
        cb(err,null);
      }else{
        cb(null,reslet);
      }
    })
  })
}

module.exports.beginTransaction = (connection, cb) => {
  if (typeof cb == "function") {
    connection.beginTransaction(function (err) {
      if (err) {
        throw err;
      }
      cb(null, connection);
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.beginTransaction(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }
};
module.exports.commit = (connection, cb) => {
  if (typeof cb == "function") {
    connection.commit(function (err) {
      if (err) {
        connection.rollback(function () {
          cb && cb(err);
          throw err;
        });
      }
      connection.release();
      cb && cb();
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            reject(err);
          });
        }
        connection.release();
        resolve();
      });
    });
  }
};
//回滚
function rollback (connection, cb){
  if (typeof cb == "function") {
    connection.rollback(function () {
      connection.release();
      cb && cb();
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.rollback(function (err) {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * 带事务
 * @param sql
 * @param values
 * @returns {Promise}
 */
module.exports.query2 = (connection, sql, values, cb) => {
  if (typeof cb == "function") {
    connection.query(sql, values, (error, rows) => {
      cb(error, rows);
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, rows) => {
        if (error)
          reject(error);
        else
          resolve(rows);
      });
    });
  }
};

module.exports.pool =pool;
module.exports.config =config;
