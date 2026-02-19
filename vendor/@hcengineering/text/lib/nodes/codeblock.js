"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var codeblock_exports = {};
__export(codeblock_exports, {
  CodeBlockExtension: () => CodeBlockExtension,
  backtickInputRegex: () => backtickInputRegex,
  codeBlockOptions: () => codeBlockOptions,
  tildeInputRegex: () => tildeInputRegex
});
module.exports = __toCommonJS(codeblock_exports);
var import_core = require("@tiptap/core");
var import_extension_code_block = __toESM(require("@tiptap/extension-code-block"));
const codeBlockOptions = {
  defaultLanguage: "plaintext",
  languageClassPrefix: "language-",
  exitOnArrowDown: true,
  exitOnTripleEnter: true,
  HTMLAttributes: {
    class: "proseCodeBlock"
  }
};
const backtickInputRegex = /^```$/;
const tildeInputRegex = /^~~~$/;
const CodeBlockExtension = import_extension_code_block.default.extend({
  marks: "inline-comment",
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: /* @__PURE__ */ __name((element) => {
          const { languageClassPrefix } = this.options;
          let fchild = element.firstElementChild;
          if (fchild == null) {
            for (const c of element.childNodes) {
              if (c.nodeType === 1) {
                fchild = c;
              }
            }
          }
          const classNames = [...Array.from(fchild?.classList ?? [])];
          if (classNames.length === 0 && fchild?.className !== void 0) {
            classNames.push(fchild?.className);
          }
          const languages = classNames.filter((className) => className.startsWith(languageClassPrefix)).map((className) => className.replace(languageClassPrefix, ""));
          const language = languages[0];
          if (language == null) {
            return null;
          }
          return language;
        }, "parseHTML"),
        rendered: false
      }
    };
  },
  addInputRules() {
    return [
      (0, import_core.textblockTypeInputRule)({
        find: backtickInputRegex,
        type: this.type
      }),
      (0, import_core.textblockTypeInputRule)({
        find: tildeInputRegex,
        type: this.type
      })
    ];
  }
});
//# sourceMappingURL=codeblock.js.map
