# d3-bundler-ui
A Web application for defining custom d3 builds.

[![](http://curran.github.io/images/d3-bundler-ui/prototype.png)](https://dry-tundra-5462.herokuapp.com/)

[Try it out!](https://dry-tundra-5462.herokuapp.com/)

Work in progress, just getting started.

### Generating index.js

The following function call

```javascript
d3BundlerUI.generateIndexJS(["select", "event", "transition"]);
```

will generate the following source code:

```javascript
import { select } from "d3-selection";
import { event } from "d3-selection";
import { transition } from "d3-transition";

export default {
  select: select,
  get event() { return event; },
  transition: transition
};
```

### Generating a D3 Bundle

The following function call

```javascript
d3BundlerUI.generateBundle(["select", "event", "transition"]);
```

will generate the text found in [d3-select-event-bundle.js](https://github.com/curran/d3-bundler-ui/blob/master/d3-select-event-bundle.js).

The bundle is dynamically constructed by invoking d3-bundler on an automatically generated bundle index file.

It takes about half a second to generate the bundle.

In order for this to work, all listed modules must have entries in `modules.json`, and their Node modules must be installed locally (they should be added as dependencies in `package.json`).

### Express Server

You can launch the Web server by running:

```
npm install
node index.js
```

When you access the URL `http://localhost:5000/select,event`, the text found in [d3-select-event-bundle.js](https://github.com/curran/d3-bundler-ui/blob/master/d3-select-event-bundle.js) is rendered. An arbitrary list of comma separated d3 module names can be included.

When you access [`http://localhost:5000/`](http://localhost:5000/), you will see the AngularJS user interface for selecting modules to include.

### Please help!
If you are at all interested in helping make this happen, your help would be greatly appreciated. Check out the [open issues](https://github.com/curran/d3-bundler-ui/issues).
