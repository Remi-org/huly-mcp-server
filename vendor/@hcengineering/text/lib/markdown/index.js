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
var markdown_exports = {};
__export(markdown_exports, {
  markupToMarkdown: () => markupToMarkdown,
  parseMessageMarkdown: () => parseMessageMarkdown,
  serializeMessage: () => serializeMessage
});
module.exports = __toCommonJS(markdown_exports);
var import_text_core = require("@hcengineering/text-core");
var import_extensions = require("../extensions");
var import_parser = require("./parser");
var import_serializer = require("./serializer");
function parseMessageMarkdown(message, imageUrl, refUrl = "ref://", extensions = import_extensions.defaultExtensions) {
  const parser = new import_parser.MarkdownParser(extensions, refUrl, imageUrl);
  return parser.parse(message ?? "");
}
__name(parseMessageMarkdown, "parseMessageMarkdown");
function serializeMessage(node, refUrl, imageUrl) {
  const state = new import_serializer.MarkdownState(import_serializer.storeNodes, import_serializer.storeMarks, { tightLists: true, refUrl, imageUrl });
  state.renderContent(node);
  return state.out;
}
__name(serializeMessage, "serializeMessage");
async function markupToMarkdown(markup, refUrl = "ref://", imageUrl = "http://localhost", preprocessor) {
  const json = (0, import_text_core.markupToJSON)(markup);
  await preprocessor?.(json);
  return serializeMessage(json, refUrl, imageUrl);
}
__name(markupToMarkdown, "markupToMarkdown");
//# sourceMappingURL=index.js.map
