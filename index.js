var fs = require("fs");

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

var express = require("express");
var app = express();

app.get("/:modulesList", function (req, res) {
  console.log(req.params.modulesList);
  var modulesToInclude = parseModulesList(req.params.modulesList);
  var indexJS = generateIndexJS(modulesToInclude);

  res.format({
    text: function(){
      res.send(indexJS);
    }
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
