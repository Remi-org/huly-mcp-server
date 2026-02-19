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
var comment_exports = {};
__export(comment_exports, {
  CommentNode: () => CommentNode
});
module.exports = __toCommonJS(comment_exports);
var import_core = require("@tiptap/core");
const CommentNode = import_core.Node.create({
  name: "comment",
  group: "inline",
  inline: true,
  content: "text*",
  marks: "_",
  parseHTML() {
    return [
      {
        tag: "comment"
      }
    ];
  },
  renderText() {
    return "";
  }
});
//# sourceMappingURL=comment.js.map
