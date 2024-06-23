import typedArray from "../shared/typed-array";

const enforceNew = [
  "Object",
  "Array",
  "ArrayBuffer",
  "DataView",
  "Date",
  "Error",
  "Function",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Promise",
  "RegExp",
  "SharedArrayBuffer",
  "Proxy",
  "WeakRef",
  "FinalizationRegistry",
  ...typedArray
];

const disallowNew = ["BigInt", "Boolean", "Number", "String", "Symbol"];

export default {
  enforceNew,
  disallowNew
};
