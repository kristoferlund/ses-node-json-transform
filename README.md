# ses-node-json-transform

This module is a hardened version of [node-json-transform](https://www.npmjs.com/package/node-json-transform) - A node module for transforming and performing operations on JSON. It uses [SES](https://github.com/endojs/endo/tree/master/packages/ses#readme) to prevent prototype pollution and other attacks. The transform functions `run` and `each` are wrapped in a `Compartment` to prevent access to global scope.

From SES README:

> SES safely executes third-party JavaScript 'strict' mode programs in compartments that have no excess authority in their global scope. SES runs atop an ES6-compliant platform, enabling safe interaction of mutually-suspicious code, using object-capability -style programming.

## Installation

In addition to `ses-node-json-transform` you also need to install `ses`.

```bash
npm install ses-node-json-transform ses --save
```

### Get Started

Import `ses` and call `lockdown()` before running any transformations. `lockdown()` accepts parameters to configure the SES environment. See [SES README](https://github.com/endojs/endo/blob/5003d9282b92d371899cfabc7ded714f5d80e06f/packages/ses/docs/lockdown.md) for more information. When running SES in a Node project, you most likely need to pass `lockdown({ domainTaming: 'unsafe' })` to support modules that depend on the `domain` module.

```javascript
import "ses";
import { transform } from "ses-node-json-transform";

lockdown();

const data = [
  {
    title: "a title",
    number: "1.25",
  },
];

const map = {
  item: {
    title: "title",
    number: "number",
  },
  operate: [
    {
      run: "(val) => val.toUpperCase()",
      on: "title",
    },
    {
      run: "(val) => Math.floor(val)",
      on: "number",
    },
  ],
};

const result = transform(data, map);
// result: [{ title: "A TITLE", number: 1 }]
```

## Feature changes compared to node-json-transform

- ses-node-json-transform only accepts string format `run` and `each` functions.
- `run` and `each` functions are given access to the `Math` object.
- ses-node-json-transform does not support nested transforms.
- Added bundled TypeScript types.

## Transform API

`transform (data, map, context)`

### Parameters

| Parameter | Type          | Required | Description                                      |
| --------- | ------------- | -------- | ------------------------------------------------ |
| data      | Object, Array | true     | The JSON data that you want to transform         |
| map       | Object        | true     | How you want to tranform it                      |
| context   | Object        | false    | Context to bind to for each item transformation. |

### Returns

Object or Array based on input.

#### Object

If an object is passed in, it will transform the object and return the resulting object.

#### Array

If an array is passed in, each item will be iterated, transformed, and the entire result will be returned. If no "list" is passed map, it will used the data as is.

## See original module [node-json-transform](https://www.npmjs.com/package/node-json-transform) for more documentation and examples.

## Changelog

0.0.1 Initial release based on v1.1.2 of node-json-transform

## Credits

Hardening additions:

- [Kristofer Lund](https://github.com/kristoferlund)

Author of node-json-transform:

- [Michael Bosworth](http://github.com/bozzltron)

## License

(The MIT License)

Copyright (c) 2014 Michael Bosworth

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
