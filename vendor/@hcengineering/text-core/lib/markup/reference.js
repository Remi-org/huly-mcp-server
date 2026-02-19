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
var reference_exports = {};
__export(reference_exports, {
  extractReferences: () => extractReferences
});
module.exports = __toCommonJS(reference_exports);
var import_model = require("../markup/model");
var import_traverse = require("../markup/traverse");
function extractReferences(content) {
  const result = [];
  (0, import_traverse.traverseNode)(content, (node, parent) => {
    if (node.type === import_model.MarkupNodeType.reference) {
      const reference = node;
      const objectId = reference.attrs.id;
      const objectClass = reference.attrs.objectclass;
      const e = result.find((e2) => e2.objectId === objectId && e2.objectClass === objectClass);
      if (e === void 0) {
        result.push({ objectId, objectClass, parentNode: parent ?? node });
      }
    }
    return true;
  });
  return result;
}
__name(extractReferences, "extractReferences");
//# sourceMappingURL=reference.js.map
