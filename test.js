var d3BundlerUI = require("./index.js");

var assert = require("assert");

describe("d3-ui-bundler", function () {
  it("should generate index.js from a list of modules", function() {

    var indexJS = d3BundlerUI(["select", "event", "transition"]);

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
});
