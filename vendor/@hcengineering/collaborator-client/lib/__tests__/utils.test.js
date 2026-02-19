"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_core = __toESM(require("@hcengineering/core"));
var import_utils = require("../utils");
describe("utils", () => {
  it("encodeDocumentId", () => {
    const doc = {
      objectClass: import_core.default.class.Doc,
      objectId: "doc1",
      objectAttr: "description"
    };
    expect((0, import_utils.encodeDocumentId)("ws1", doc)).toEqual("ws1|core:class:Doc|doc1|description");
  });
  describe("decodeDocumentId", () => {
    expect((0, import_utils.decodeDocumentId)("ws1|core:class:Doc|doc1|description")).toEqual({
      workspaceId: "ws1",
      documentId: {
        objectClass: import_core.default.class.Doc,
        objectId: "doc1",
        objectAttr: "description"
      }
    });
  });
});
//# sourceMappingURL=utils.test.js.map
