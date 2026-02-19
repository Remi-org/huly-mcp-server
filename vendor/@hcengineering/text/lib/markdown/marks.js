"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var marks_exports = {};
__export(marks_exports, {
  addToSet: () => addToSet,
  isInSet: () => isInSet,
  markAttrs: () => markAttrs,
  markEq: () => markEq,
  removeFromSet: () => removeFromSet,
  sameSet: () => sameSet,
  traverseMarks: () => traverseMarks
});
module.exports = __toCommonJS(marks_exports);
var import_fast_equals = require("fast-equals");
function traverseMarks(node, f) {
  node.marks?.forEach(f);
}
__name(traverseMarks, "traverseMarks");
function markAttrs(mark) {
  return mark.attrs ?? [];
}
__name(markAttrs, "markAttrs");
function isInSet(mark, marks) {
  return marks.find((m) => markEq(mark, m)) !== void 0;
}
__name(isInSet, "isInSet");
function addToSet(mark, marks) {
  const m = marks.find((m2) => markEq(mark, m2));
  if (m !== void 0) {
    return marks;
  }
  return [...marks, mark];
}
__name(addToSet, "addToSet");
function removeFromSet(markType, marks) {
  return marks.filter((m) => m.type !== markType);
}
__name(removeFromSet, "removeFromSet");
function sameSet(a, b) {
  return (0, import_fast_equals.deepEqual)(a, b);
}
__name(sameSet, "sameSet");
function markEq(first, other) {
  return (0, import_fast_equals.deepEqual)(first, other);
}
__name(markEq, "markEq");
//# sourceMappingURL=marks.js.map
