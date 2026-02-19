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
var utils_exports = {};
__export(utils_exports, {
  decodeDocumentId: () => decodeDocumentId,
  encodeDocumentId: () => encodeDocumentId
});
module.exports = __toCommonJS(utils_exports);
function encodeDocumentId(workspaceId, documentId) {
  const { objectClass, objectId, objectAttr } = documentId;
  return [workspaceId, objectClass, objectId, objectAttr].join("|");
}
__name(encodeDocumentId, "encodeDocumentId");
function decodeDocumentId(documentId) {
  const [workspaceId, objectClass, objectId, objectAttr] = documentId.split("|");
  return {
    workspaceId,
    documentId: {
      objectClass,
      objectId,
      objectAttr
    }
  };
}
__name(decodeDocumentId, "decodeDocumentId");
//# sourceMappingURL=utils.js.map
