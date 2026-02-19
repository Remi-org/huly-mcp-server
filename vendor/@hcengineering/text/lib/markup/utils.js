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
  getMarkup: () => getMarkup,
  htmlToJSON: () => htmlToJSON,
  htmlToMarkup: () => htmlToMarkup,
  htmlToPmNode: () => htmlToPmNode,
  jsonToHTML: () => jsonToHTML,
  jsonToPmNode: () => jsonToPmNode,
  jsonToText: () => jsonToText,
  markupHtmlToJSON: () => markupHtmlToJSON,
  markupToPmNode: () => markupToPmNode,
  pmNodeToHTML: () => pmNodeToHTML,
  pmNodeToJSON: () => pmNodeToJSON,
  pmNodeToMarkup: () => pmNodeToMarkup,
  pmNodeToText: () => pmNodeToText
});
module.exports = __toCommonJS(utils_exports);
var import_core2 = require("@tiptap/core");
var import_html = require("@tiptap/html");
var import_model = require("@tiptap/pm/model");
var import_text_core = require("@hcengineering/text-core");
var import_extensions = require("../extensions");
const defaultSchema = (0, import_core2.getSchema)(import_extensions.defaultExtensions);
function getMarkup(editor) {
  return (0, import_text_core.jsonToMarkup)(editor?.getJSON());
}
__name(getMarkup, "getMarkup");
function pmNodeToMarkup(node) {
  return (0, import_text_core.jsonToMarkup)(pmNodeToJSON(node));
}
__name(pmNodeToMarkup, "pmNodeToMarkup");
function markupToPmNode(markup, schema, extensions) {
  const json = (0, import_text_core.markupToJSON)(markup);
  return jsonToPmNode(json, schema, extensions);
}
__name(markupToPmNode, "markupToPmNode");
function markupHtmlToJSON(markup) {
  if (markup == null || markup === "") {
    return (0, import_text_core.emptyMarkupNode)();
  }
  try {
    if (markup.startsWith("{")) {
      return JSON.parse(markup);
    } else if (markup.startsWith("<")) {
      return htmlToJSON(markup, import_extensions.defaultExtensions);
    } else {
      return (0, import_text_core.nodeDoc)((0, import_text_core.nodeParagraph)((0, import_text_core.nodeText)(markup)));
    }
  } catch (error) {
    return (0, import_text_core.emptyMarkupNode)();
  }
}
__name(markupHtmlToJSON, "markupHtmlToJSON");
function jsonToPmNode(json, schema, extensions) {
  schema ??= extensions == null ? defaultSchema : (0, import_core2.getSchema)(extensions ?? import_extensions.defaultExtensions);
  return import_model.Node.fromJSON(schema, json);
}
__name(jsonToPmNode, "jsonToPmNode");
function pmNodeToJSON(node) {
  return node.toJSON();
}
__name(pmNodeToJSON, "pmNodeToJSON");
function jsonToText(node, schema, extensions) {
  const pmNode = jsonToPmNode(node, schema, extensions);
  return pmNode.textBetween(0, pmNode.content.size, "\n", "");
}
__name(jsonToText, "jsonToText");
function pmNodeToText(node) {
  return jsonToText(node.toJSON());
}
__name(pmNodeToText, "pmNodeToText");
function htmlToMarkup(html, extensions) {
  const json = htmlToJSON(html, extensions);
  return (0, import_text_core.jsonToMarkup)(json);
}
__name(htmlToMarkup, "htmlToMarkup");
function htmlToJSON(html, extensions) {
  extensions = extensions ?? import_extensions.defaultExtensions;
  return (0, import_html.generateJSON)(html, extensions, { preserveWhitespace: "full" });
}
__name(htmlToJSON, "htmlToJSON");
function jsonToHTML(json, extensions) {
  extensions = extensions ?? import_extensions.defaultExtensions;
  return (0, import_html.generateHTML)(json, extensions);
}
__name(jsonToHTML, "jsonToHTML");
function htmlToPmNode(html, schema, extensions) {
  schema ??= extensions == null ? defaultSchema : (0, import_core2.getSchema)(extensions ?? import_extensions.defaultExtensions);
  const json = htmlToJSON(html, extensions);
  return import_model.Node.fromJSON(schema, json);
}
__name(htmlToPmNode, "htmlToPmNode");
function pmNodeToHTML(node, extensions) {
  extensions ??= import_extensions.defaultExtensions;
  return (0, import_html.generateHTML)(node.toJSON(), extensions);
}
__name(pmNodeToHTML, "pmNodeToHTML");
//# sourceMappingURL=utils.js.map
