Promise = require('bluebird');
mysql = require('mysql');
DBF = require('./buttons.dbf-setup.js');



module.exports = {
  getButtonInfo: function() { //Returns a promise that can take a handler ready to process the results
    // What do we do about the database?
    var sql = "SELECT * FROM mitc0417.till_buttons";
    return DBF.query(mysql.format(sql)); //Return a promise
  },

  processButtons: function(queryResults) {
    var buttonArray = [];
    for(var i = 0; i < queryResults.length; i++)
    {
      buttonArray.push({
        buttonID: queryResults[i].buttonID,
        left: queryResults[i].left,
        top: queryResults[i].top,
        width: queryResults[i].width,
        label: queryResults[i].label,
        invID: queryResults[i].buttonID});
    }
    return buttonArray;
  },


getMyButtons: function()
{
    var dbf = getButtonInfo()
    .then(processButtons)
    .then(DBF.releaseDBF)
    .catch(function(err){console.log("DANGER:",err)});

    console.log(dbf);
    return dbf;
  }
}
