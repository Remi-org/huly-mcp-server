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
var types_exports = {};
__export(types_exports, {
  MarkupContent: () => MarkupContent,
  html: () => html,
  markdown: () => markdown
});
module.exports = __toCommonJS(types_exports);
class MarkupContent {
  constructor(content, kind) {
    this.content = content;
    this.kind = kind;
  }
  static {
    __name(this, "MarkupContent");
  }
}
function html(content) {
  return new MarkupContent(content, "html");
}
__name(html, "html");
function markdown(content) {
  return new MarkupContent(content, "markdown");
}
__name(markdown, "markdown");
//# sourceMappingURL=types.js.map
