'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-8da8e015.js');

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return undefined;
  return index.bootstrapLazy([["my-component.cjs",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;

//# sourceMappingURL=loader.cjs.js.map