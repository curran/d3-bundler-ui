var fs = require("fs");

var exec = require("child_process").exec;

var express = require("express");
var app = express();

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
var generateBundle = (function (){

  // Use different file names for different requests,
  // to support concurrent requests.
  var bundleCounter = 0;

  return function (modulesToInclude, callback){

    var indexJS = generateIndexJS(modulesToInclude);
    var bundleFileName = "bundle" + bundleCounter + ".js";

    // Make sure it doesn't break after running for centuries.
    // Did you know that 100000000000000000+1 === 100000000000000000 ?
    bundleCounter = (bundleCounter + 1) % 1000000000;

    fs.writeFile(bundleFileName, indexJS, function(err) {
      if(err) { return console.log(err); }

      var cmd = "./node_modules/.bin/d3-bundler " + bundleFileName;

      exec(cmd, function(err, stdout, stderr) {
        callback(err, stdout);

        // Remove the temporary file
        exec("rm " + bundleFileName);
      });
    }); 
  }
}());

app.get("/:modulesList", function (req, res) {

  var modulesToInclude = parseModulesList(req.params.modulesList);

  generateBundle(modulesToInclude, function (err, bundleJS){
    if(err){ return res.send(err); }
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
  generateBundle: generateBundle,
  parseModulesList: parseModulesList
};
