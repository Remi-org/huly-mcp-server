"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var nodeUuid_exports = {};
__export(nodeUuid_exports, {
  NodeUuid: () => NodeUuid
});
module.exports = __toCommonJS(nodeUuid_exports);
var import_core = require("@tiptap/core");
const NAME = "node-uuid";
const NodeUuid = import_core.Mark.create({
  name: NAME,
  inline: true,
  parseHTML() {
    return [
      {
        tag: `span[${NAME}]`
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  }
});
//# sourceMappingURL=nodeUuid.js.map
