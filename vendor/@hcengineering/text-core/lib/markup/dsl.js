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
var dsl_exports = {};
__export(dsl_exports, {
  markBold: () => markBold,
  markCode: () => markCode,
  markItalic: () => markItalic,
  markLink: () => markLink,
  markStrike: () => markStrike,
  markUnderline: () => markUnderline,
  nodeDoc: () => nodeDoc,
  nodeImage: () => nodeImage,
  nodeParagraph: () => nodeParagraph,
  nodeReference: () => nodeReference,
  nodeText: () => nodeText
});
module.exports = __toCommonJS(dsl_exports);
var import_model = require("./model");
function nodeDoc(...content) {
  return node(import_model.MarkupNodeType.doc, ...content);
}
__name(nodeDoc, "nodeDoc");
function nodeParagraph(...content) {
  return node(import_model.MarkupNodeType.paragraph, ...content);
}
__name(nodeParagraph, "nodeParagraph");
function nodeText(text) {
  return { type: import_model.MarkupNodeType.text, text };
}
__name(nodeText, "nodeText");
function nodeImage(attrs) {
  return { type: import_model.MarkupNodeType.image, attrs };
}
__name(nodeImage, "nodeImage");
function nodeReference(attrs) {
  return { type: import_model.MarkupNodeType.reference, attrs };
}
__name(nodeReference, "nodeReference");
function markBold(node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.bold));
}
__name(markBold, "markBold");
function markCode(node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.code));
}
__name(markCode, "markCode");
function markItalic(node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.em));
}
__name(markItalic, "markItalic");
function markStrike(node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.strike));
}
__name(markStrike, "markStrike");
function markUnderline(node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.underline));
}
__name(markUnderline, "markUnderline");
function markLink(attrs, node2) {
  return withMarks(node2, mark(import_model.MarkupMarkType.link, attrs));
}
__name(markLink, "markLink");
function node(type, ...content) {
  return { type, content };
}
__name(node, "node");
function mark(type, attrs) {
  return { type, attrs: attrs ?? {} };
}
__name(mark, "mark");
function withMarks(node2, ...marks) {
  const current = node2.marks ?? [];
  current.push(...marks);
  return { ...node2, marks: current };
}
__name(withMarks, "withMarks");
//# sourceMappingURL=dsl.js.map
