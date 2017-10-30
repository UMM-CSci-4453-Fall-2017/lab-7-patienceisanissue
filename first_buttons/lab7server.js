var express=require('express'),
    app = express(),
    port = process.env.PORT || 1337;
var Promise = require('bluebird');
var mysql = require('mysql');
var DBF = require('./buttons.dbf-setup.js');


//var buttons=[{"buttonID":1,"left":10,"top":70,"width":100,"label":"hotdogs","invID":1},{"buttonID":2,"left":110,"top":70,"width":100,"label":"hambugers","invID":2},{"buttonID":3,"left":210,"top":70,"width":100,"label":"bannanas","invID":3},{"buttonID":4,"left":10,"top":120,"width":100,"label":"milkduds","invID":4}]; //static buttons

var buttons = [];

var getButtonInfo = function() { //Returns a promise that can take a handler ready to process the results
  // What do we do about the database?
  var sql = "SELECT * FROM mitc0417.till_buttons";
  return DBF.query(mysql.format(sql)); //Return a promise
}

var processButtons = function(queryResults) {
  for(var i = 0; i < queryResults.length; i++)
  {
    buttons.push({
      buttonID: queryResults[i].buttonID,
      left: queryResults[i].left,
      top: queryResults[i].top,
      width: queryResults[i].width,
      label: queryResults[i].label,
      invID: queryResults[i].buttonID});
  }
}

var dbf = getButtonInfo()
.then(processButtons)
.then(DBF.releaseDBF)
.catch(function(err){console.log("DANGER:",err)});



app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
  //Add SQL stuff here

res.send(buttons);
});

app.listen(port);
