angular.module("d3-bundler-ui", [])
  // TODO refactor this code into several files
  //.factory("packages", function (){
  //})
  .controller("ModulesController", ["$http", function($http) {

    var modules = this;

    $http.get("packages.json").then(function (packages){
      modules.packages = packages.data
      modules.build = function() {

        // flatten the array of modules from all packages.
        var modulesArr = modules.packages
          .map(function (package){ return package.modules; })
          .reduce(function (a, b){ return a.concat(b); }, []);

        // Isolate the names of included modules.
        var includedModulesArr = modulesArr
          .filter(function (d){ return d.included; })
          .map(function (d){ return d.name; });

        // Construct the comma-separated string that the server API expects.
        var includedModulesStr = includedModulesArr.join(",");

        // Download the bundle to the user from the API.
        // Inspired by http://stackoverflow.com/questions/25087009/trigger-a-file-download-on-click-of-button-javascript-with-contents-from-dom
        // Uses HTML5 "download" attribute, which is not supported on all browsers.
        // http://caniuse.com/#feat=download
        var dl = document.createElement("a");
        dl.setAttribute("href", includedModulesStr);
        dl.setAttribute("download", "d3-custom.js");
        dl.click();
      };
    });
  }]);
