# d3-bundler-ui
A Web application for defining custom d3 builds.

WIP, just getting started. So far this project consists of a function that generates JavaScript source code for a D3 bundle given an array of D3 modules names.

For example, the following function call

```javascript
d3BundlerUI(["select", "event", "transition"]);
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
