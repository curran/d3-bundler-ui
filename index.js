var fs = require("fs");

var exec = require('child_process').exec;
var cmd = 'prince -v builds/pdf/book.html -o builds/pdf/book.pdf';

var express = require("express");
var app = express();

var async = require("async");

// Generates the JavaScript code for the top-level D3 bundle.
// Takes as input an array of module names to include.
// These module names should correspond with the keys found in the file `modules.json`
var generateIndexJS = (function (){
  var modules = JSON.parse(fs.readFileSync("modules.json", "utf8"));
  return function (modulesToInclude){
    return [
      modulesToInclude.map(function (module){
        return modules[module].import;
      }).join("\n"),
      "",
      "export default {",
      modulesToInclude.map(function (module){
        return "  " + modules[module].export;
      }).join(",\n"),
      "};"
    ].join("\n");
  };
}());

// Parses a comma-separated list of modules names.
function parseModulesList(modulesList){
  return modulesList.split(",").map(function (str){
    return str.trim();
  });
}

// Generates the D3 bundle using d3-bundler.
function generateBundle(modulesToInclude, callback){

  // TODO write this file
  //var indexJS = generateIndexJS(modulesToInclude);
  
  var cmd = "./node_modules/.bin/d3-bundler bundle.js";
  exec(cmd, function(error, stdout, stderr) {
    callback(stderr, stdout);
  });
}

app.get("/:modulesList", function (req, res) {

  var modulesToInclude = parseModulesList(req.params.modulesList);

  generateBundle(modulesToInclude, function (err, bundleJS){
    console.log(err);
    console.log(bundleJS);
    res.format({
      js: function(){
        res.send(bundleJS);
      }
    });
  });
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Head on over to http://localhost:" + port + "/select,event,transition");
});

module.exports = {
  generateIndexJS: generateIndexJS,
  parseModulesList: parseModulesList
};
