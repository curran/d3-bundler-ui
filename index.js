var fs = require("fs");

// Read modules.json
var modules = JSON.parse(fs.readFileSync("modules.json", "utf8"));

// Generates the JavaScript code for the top-level D3 bundle.
// Takes as input an array of module names to include.
// These module names should correspond with the keys found in the file `modules.json`
module.exports = function generateIndexJS(modulesToInclude){
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
