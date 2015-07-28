# d3-bundler-ui
A Web application for defining custom d3 builds.

WIP, just getting started. So far this project consists of a function that generates JavaScript source code for a D3 bundle given an array of D3 modules names, and a Web server that exposes that functionality.

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

### Express Server

You can launch the server by running:

```
npm install
node index.js
```

When you access the URL `http://localhost:3000/select,event`, the following text is rendered:

```
import { select } from "d3-selection";
import { event } from "d3-selection";

export default {
  select: select,
  get event() { return event; }
};
```
