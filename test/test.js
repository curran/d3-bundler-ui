var d3BundlerUI = require("../index.js");

var fs = require("fs");
var assert = require("assert");

describe("d3-ui-bundler", function () {

  it("should generate index.js from a list of modules", function() {

    var indexJS = d3BundlerUI.generateIndexJS(["select", "event", "transition"]);

    assert.equal(indexJS, [
      "import { select } from \"d3-selection\";",
      "import { event } from \"d3-selection\";",
      "import { transition } from \"d3-transition\";",
      "",
      "export default {",
      "  select: select,",
      "  get event() { return event; },",
      "  transition: transition",
      "};",
    ].join("\n"));
  });

  it("should parse a comma-separed list of module names", function() {

    var modulesArr = d3BundlerUI.parseModulesList("select,event  , transition");

    assert.equal(modulesArr.join(" "), "select event transition");
  });

  // TODO improve these tests such that each module is tested individually.
  it("should generate a D3 bundle", function(done) {

    var expected = fs.readFileSync("test/d3-select-event-bundle.js", "utf8");

    d3BundlerUI.generateBundle(["select", "event"], function (err, bundleJS){
      assert.equal(bundleJS, expected);
      done();
    });
  });
});
