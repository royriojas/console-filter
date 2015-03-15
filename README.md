[![NPM Version](http://img.shields.io/npm/v/console-filter.svg?style=flat)](https://npmjs.org/package/console-filter)
[![Build Status](http://img.shields.io/travis/royriojas/console-filter.svg?style=flat)](https://travis-ci.org/royriojas/console-filter)

# console-filter
> browserify transform to remove calls to console methods that do not match the given filter 

## Overview
This transform will turn this: 

```javascript
//my-module.js
var someFunc = function () {
  console.log('some-value: here', 1);
  console.log('my-prefix: hello');
};
module.exports = someFunc;
```

Into this:

```javascript
//my-module.js
var someFunc = function () {

  console.log('my-prefix: hello');
};
module.exports = someFunc;
```
when configured with a filter like `my-prefix`.
```javascript
var console-filter = require( 'console-filter' ).configure({
  filter: 'my-prefix'
});

```

## Install

```bash
npm i --save-dev console-filter
```

## Usage

```
var console-filter = require( 'console-filter' ).configure({
  filter: 'my-prefix'
});

var b = browserify();
b.add('./my-module');
b.transform( console-filter );
b.bundle().pipe(process.stdout);
```
