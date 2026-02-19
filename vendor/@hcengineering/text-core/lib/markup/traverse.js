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
var traverse_exports = {};
__export(traverse_exports, {
  traverseAllMarks: () => traverseAllMarks,
  traverseNode: () => traverseNode,
  traverseNodeContent: () => traverseNodeContent,
  traverseNodeMarks: () => traverseNodeMarks
});
module.exports = __toCommonJS(traverse_exports);
function traverseNode(node, fn) {
  _traverseNode(node, void 0, fn);
}
__name(traverseNode, "traverseNode");
function _traverseNode(node, parent, fn) {
  const result = fn(node, parent);
  if (result !== false) {
    node.content?.forEach((p) => {
      _traverseNode(p, node, fn);
    });
  }
}
__name(_traverseNode, "_traverseNode");
function traverseNodeMarks(node, f) {
  node.marks?.forEach((p) => {
    f(p);
  });
}
__name(traverseNodeMarks, "traverseNodeMarks");
function traverseNodeContent(node, f) {
  node.content?.forEach((p) => {
    f(p);
  });
}
__name(traverseNodeContent, "traverseNodeContent");
function traverseAllMarks(node, f) {
  traverseNode(node, (node2) => {
    traverseNodeMarks(node2, (mark) => {
      f(node2, mark);
    });
    return true;
  });
}
__name(traverseAllMarks, "traverseAllMarks");
//# sourceMappingURL=traverse.js.map
