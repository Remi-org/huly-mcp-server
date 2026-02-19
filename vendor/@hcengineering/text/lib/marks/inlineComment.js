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
var inlineComment_exports = {};
__export(inlineComment_exports, {
  InlineCommentMark: () => InlineCommentMark,
  InlineCommentPasteFixPlugin: () => InlineCommentPasteFixPlugin
});
module.exports = __toCommonJS(inlineComment_exports);
var import_core = require("@tiptap/core");
var import_model = require("@tiptap/pm/model");
var import_state = require("@tiptap/pm/state");
const InlineCommentMark = import_core.Mark.create({
  name: "inline-comment",
  excludes: "",
  inclusive: false,
  parseHTML() {
    return [
      {
        tag: "span.proseInlineComment[data-inline-comment-thread]"
      }
    ];
  },
  renderHTML({ HTMLAttributes, mark }) {
    return ["span", { ...HTMLAttributes, class: "proseInlineComment" }, 0];
  },
  addAttributes() {
    const name = "data-inline-comment-thread-id";
    return {
      thread: {
        default: void 0,
        parseHTML: /* @__PURE__ */ __name((element) => {
          return element.getAttribute(name);
        }, "parseHTML"),
        renderHTML: /* @__PURE__ */ __name((attributes) => {
          return { [name]: attributes.thread };
        }, "renderHTML")
      }
    };
  },
  addProseMirrorPlugins() {
    return [...this.parent?.() ?? [], InlineCommentPasteFixPlugin()];
  }
});
function removeMarkFromNode(node, name) {
  if (node.isText) {
    return node.mark(node.marks.filter((mark) => mark.type.name !== name));
  }
  if (node.content.size > 0) {
    const nodes = [];
    node.content.forEach((child) => {
      nodes.push(removeMarkFromNode(child, name));
    });
    return node.copy(import_model.Fragment.fromArray(nodes));
  }
  return node;
}
__name(removeMarkFromNode, "removeMarkFromNode");
function InlineCommentPasteFixPlugin() {
  return new import_state.Plugin({
    key: new import_state.PluginKey("inline-comment-paste-fix-plugin"),
    props: {
      transformPasted: /* @__PURE__ */ __name((slice) => {
        const nodes = [];
        slice.content.forEach((node) => {
          nodes.push(removeMarkFromNode(node, "inline-comment"));
        });
        return new import_model.Slice(import_model.Fragment.fromArray(nodes), slice.openStart, slice.openEnd);
      }, "transformPasted")
    }
  });
}
__name(InlineCommentPasteFixPlugin, "InlineCommentPasteFixPlugin");
//# sourceMappingURL=inlineComment.js.map
