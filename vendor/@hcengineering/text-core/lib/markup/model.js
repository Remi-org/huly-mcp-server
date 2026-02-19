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
var model_exports = {};
__export(model_exports, {
  MarkupMarkType: () => MarkupMarkType,
  MarkupNodeType: () => MarkupNodeType,
  emptyMarkupNode: () => emptyMarkupNode
});
module.exports = __toCommonJS(model_exports);
var MarkupNodeType = /* @__PURE__ */ ((MarkupNodeType2) => {
  MarkupNodeType2["doc"] = "doc";
  MarkupNodeType2["paragraph"] = "paragraph";
  MarkupNodeType2["blockquote"] = "blockquote";
  MarkupNodeType2["horizontal_rule"] = "horizontalRule";
  MarkupNodeType2["heading"] = "heading";
  MarkupNodeType2["code_block"] = "codeBlock";
  MarkupNodeType2["text"] = "text";
  MarkupNodeType2["image"] = "image";
  MarkupNodeType2["file"] = "file";
  MarkupNodeType2["reference"] = "reference";
  MarkupNodeType2["hard_break"] = "hardBreak";
  MarkupNodeType2["ordered_list"] = "orderedList";
  MarkupNodeType2["bullet_list"] = "bulletList";
  MarkupNodeType2["list_item"] = "listItem";
  MarkupNodeType2["taskList"] = "taskList";
  MarkupNodeType2["taskItem"] = "taskItem";
  MarkupNodeType2["todoList"] = "todoList";
  MarkupNodeType2["todoItem"] = "todoItem";
  MarkupNodeType2["subLink"] = "subLink";
  MarkupNodeType2["table"] = "table";
  MarkupNodeType2["table_row"] = "tableRow";
  MarkupNodeType2["table_cell"] = "tableCell";
  MarkupNodeType2["table_header"] = "tableHeader";
  MarkupNodeType2["mermaid"] = "mermaid";
  MarkupNodeType2["comment"] = "comment";
  MarkupNodeType2["markdown"] = "markdown";
  return MarkupNodeType2;
})(MarkupNodeType || {});
var MarkupMarkType = /* @__PURE__ */ ((MarkupMarkType2) => {
  MarkupMarkType2["link"] = "link";
  MarkupMarkType2["em"] = "italic";
  MarkupMarkType2["bold"] = "bold";
  MarkupMarkType2["code"] = "code";
  MarkupMarkType2["strike"] = "strike";
  MarkupMarkType2["underline"] = "underline";
  return MarkupMarkType2;
})(MarkupMarkType || {});
function emptyMarkupNode() {
  return {
    type: "doc" /* doc */,
    content: [{ type: "paragraph" /* paragraph */, content: [] }]
  };
}
__name(emptyMarkupNode, "emptyMarkupNode");
//# sourceMappingURL=model.js.map
