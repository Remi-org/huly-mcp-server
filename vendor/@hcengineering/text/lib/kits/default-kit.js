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
var default_kit_exports = {};
__export(default_kit_exports, {
  DefaultKit: () => DefaultKit
});
module.exports = __toCommonJS(default_kit_exports);
var import_core = require("@tiptap/core");
var import_extension_highlight = __toESM(require("@tiptap/extension-highlight"));
var import_extension_link = __toESM(require("@tiptap/extension-link"));
var import_extension_typography = __toESM(require("@tiptap/extension-typography"));
var import_extension_underline = __toESM(require("@tiptap/extension-underline"));
var import_starter_kit = __toESM(require("@tiptap/starter-kit"));
var import_nodes = require("../nodes");
var import_code = require("../marks/code");
const DefaultKit = import_core.Extension.create({
  name: "defaultKit",
  addExtensions() {
    return [
      import_starter_kit.default.configure({
        blockquote: {
          HTMLAttributes: {
            class: "proseBlockQuote"
          }
        },
        code: this.options.code ?? import_code.codeOptions,
        codeBlock: this.options.codeBlock ?? import_nodes.codeBlockOptions,
        heading: this.options.heading,
        history: this.options.history
      }),
      import_extension_underline.default,
      import_extension_highlight.default.configure({
        multicolor: false
      }),
      import_extension_typography.default.configure({}),
      import_extension_link.default.extend({ inclusive: false }).configure({
        openOnClick: false,
        HTMLAttributes: { class: "cursor-pointer", rel: "noopener noreferrer", target: "_blank" }
      })
    ];
  }
});
//# sourceMappingURL=default-kit.js.map
