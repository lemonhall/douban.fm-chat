/*
 * webSqlWarpper.js - Warpper WebSql into LocalStorage API
 * 
 * Author: Lemon Hall ( http://www.douban.com/people/lemonhall2012 )
 * Version: 0.1  (2012-07-19)
 * License: MIT License
 */
(function(){

var webdb=(function(){
  var db=null,
  open = function() {
    var dbSize = 1024 * 1024 * 1024; // 1G
    db = openDatabase("VoiceCache", "1.0", "Voice Cache", dbSize);
  },
  createTable = function() {
        db.transaction(function(tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS VoiceCache(sid TEXT PRIMARY KEY ASC, base64 TEXT)", []);
        });
  },
  __ifExistIncache=function(sid){
    var deferred = $.Deferred(); 
    var promise = deferred.promise();

    db.transaction(function(tx){
      tx.executeSql("SELECT sid FROM VoiceCache "+
                    "WHERE sid=?"
        ,[sid],
        function(tx, r){
              //console.log("out of range?????===========")
              //console.log(r);
          if(r.rows.length){
                  deferred.resolve(true);
          }else{
                deferred.reject("no sid");
          }                
        },
        function(tx, e){
                  console.log(e);
                  deferred.reject(e);
        }
          );//END OF executeSql
     });//END OF transaction

    return promise;

  },
  setFile = function(sid,base64) {
  var deferred = $.Deferred(); 
  var promise = deferred.promise();
    db.transaction(function(tx){
    tx.executeSql("INSERT OR REPLACE INTO VoiceCache(sid,base64) VALUES (?,?)",
          [sid,base64],
          function(tx, r){
                  //var result=rs.rows.item(0);
                  deferred.resolve(r);
          },
          function(tx, e){
                  deferred.reject(e);
          }
          );//END OF executeSql
     });//END OF transaction

    return promise;
  },
  getFile = function(sid) {
    var deferred = $.Deferred(); 
    var promise = deferred.promise();

    db.transaction(function(tx){
      tx.executeSql("SELECT base64 FROM VoiceCache "+
                    "WHERE sid=?"
        ,[sid],
        function(tx, r){
          //console.log(r);
            if(r.rows.length){
                var result=r.rows.item(0);
                    deferred.resolve(result.base64);
            }else{
                  deferred.reject(r);
            }             
        },
        function(tx, e){
                  //console.log(e);
                  deferred.reject(e);
        }
          );//END OF executeSql
     });//END OF transaction

    return promise;
  };

    return {
      init: function(){
          db = null;
          open();
          createTable();
      },
      getCache: function(sid){
          return getFile(sid);
      },
      ifExistIncache:function(sid){
          return  __ifExistIncache(sid);
      },
      setCache: function(sid,base64){
          return setFile(sid,base64);
      }
    };
  })();

  // register webdb at VoiceCache object
  if(VoiceCache){
    VoiceCache = webdb;
  }
  // and initialize it
  webdb.init();
})();