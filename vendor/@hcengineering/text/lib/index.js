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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  TextStyle: () => import_extension_text_style.TextStyle
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("./extensions"), module.exports);
__reExport(index_exports, require("@hcengineering/text-core"), module.exports);
__reExport(index_exports, require("./nodes"), module.exports);
__reExport(index_exports, require("./markup/utils"), module.exports);
__reExport(index_exports, require("./marks/code"), module.exports);
__reExport(index_exports, require("./marks/colors"), module.exports);
__reExport(index_exports, require("./marks/noteBase"), module.exports);
__reExport(index_exports, require("./marks/inlineComment"), module.exports);
__reExport(index_exports, require("./markdown"), module.exports);
__reExport(index_exports, require("./markdown/serializer"), module.exports);
__reExport(index_exports, require("./markdown/parser"), module.exports);
__reExport(index_exports, require("./markdown/compare"), module.exports);
__reExport(index_exports, require("./markdown/node"), module.exports);
__reExport(index_exports, require("./kits/default-kit"), module.exports);
__reExport(index_exports, require("./kits/server-kit"), module.exports);
var import_extension_text_style = require("@tiptap/extension-text-style");
//# sourceMappingURL=index.js.map
