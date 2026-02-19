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
var node_exports = {};
__export(node_exports, {
  messageContent: () => messageContent,
  nodeAttrs: () => nodeAttrs,
  traverseMarkupNode: () => traverseMarkupNode
});
module.exports = __toCommonJS(node_exports);
function traverseMarkupNode(node, f) {
  f(node);
  node.content?.forEach((c) => {
    traverseMarkupNode(c, f);
  });
}
__name(traverseMarkupNode, "traverseMarkupNode");
function messageContent(node) {
  return node?.content ?? [];
}
__name(messageContent, "messageContent");
function nodeAttrs(node) {
  return node.attrs ?? {};
}
__name(nodeAttrs, "nodeAttrs");
//# sourceMappingURL=node.js.map
