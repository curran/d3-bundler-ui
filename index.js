// This file contains the top-level server module.

// This program launches an Express server;
var express = require("express");
var app = express();

// This line is adapted from
// https://github.com/heroku/node-js-getting-started/blob/master/index.js
var port = (process.env.PORT || 5000);

// Serve static files from the `public` directory.
// This includes the AngularJS app found at `public/index.html`.
app.use(express.static("public"));

// This program uses temporary files and a child process
// to invoke the d3-bundler command line tool.
var fs = require("fs");
var exec = require("child_process").exec;

// This is the data that powers the module selection UI.
// Found in the `public/data` directory.
var dataPaths = {

  // This file defines the 2-level hierarchy of modules.
  // This is used in the front-end code for generating the UI.
  packages: "data/packages.json",

  // This file contains code snippets for import and export.
  // This is used in the back-end code for generating the bundle.
  modules: "data/modules.json"
};

// Reads the specified JSON file from disk.
function readJSONFile(path){
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

var modules = readJSONFile(dataPaths.modules);

// Generates the JavaScript code for the top-level D3 bundle.
// Takes as input an array of module names to include.
// These module names should correspond with the keys found in the file `modules.json`
var generateIndexJS = (function (){
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

function validate(modulesToInclude){
  var err = null;
  modulesToInclude.forEach(function (module){
    if(!(module in modules)){
      err = new Error("Unknown module \"" + module + "\"");
    };
  });
  return err;
}

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

    var err = validate(modulesToInclude);

    if(err){
      return callback(err);
    }

    var indexJS = generateIndexJS(modulesToInclude);
    var bundleFileName = "bundle" + bundleCounter + ".js";

    var header = [
      "// This is a D3 custom bundle that includes the following modules:",
      modulesToInclude.map(function (module){
        return "// - d3." + module;
      }).join("\n")
    ].join("\n");

    // Make sure it doesn't break after running for centuries.
    // Did you know that 100000000000000000+1 === 100000000000000000 ?
    bundleCounter = (bundleCounter + 1) % 1000000000;

    fs.writeFile(bundleFileName, indexJS, function(err) {
      if(err) { return console.log(err); }

      var cmd = "./node_modules/.bin/d3-bundler " + bundleFileName;

      exec(cmd, function(err, stdout, stderr) {
        var bundle = [header, stdout].join("\n\n");
        callback(err, bundle);

        // Remove the temporary file
        exec("rm " + bundleFileName);
      });
    }); 
  }
}());

app.get("/:modulesList", function (req, res) {

  var modulesToInclude = parseModulesList(req.params.modulesList);

  generateBundle(modulesToInclude, function (err, bundleJS){
    if(err){
      return res.send(err.message);
    }
    res.format({
      "application/javascript": function(){
        res.send(bundleJS);
      }
    });
  });
});

var server = app.listen(port, function () {
  console.log("Head on over to http://localhost:" + port + "/select,event,transition");
});

module.exports = {
  generateIndexJS: generateIndexJS,
  generateBundle: generateBundle,
  parseModulesList: parseModulesList
};
