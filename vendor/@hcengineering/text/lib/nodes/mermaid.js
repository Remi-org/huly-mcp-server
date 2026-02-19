"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mermaid_exports = {};
__export(mermaid_exports, {
  MermaidExtension: () => MermaidExtension,
  mermaidOptions: () => mermaidOptions
});
module.exports = __toCommonJS(mermaid_exports);
var import_extension_code_block = __toESM(require("@tiptap/extension-code-block"));
var import_codeblock = require("./codeblock");
const mermaidOptions = {
  ...import_codeblock.codeBlockOptions,
  defaultLanguage: "mermaid"
};
const MermaidExtension = import_extension_code_block.default.extend({
  name: "mermaid",
  group: "block",
  marks: "inline-comment",
  parseHTML() {
    return [
      {
        tag: "div.mermaid-diagram",
        preserveWhitespace: "full"
      }
    ];
  },
  addAttributes() {
    return {
      language: {
        default: "mermaid"
      }
    };
  }
});
//# sourceMappingURL=mermaid.js.map
