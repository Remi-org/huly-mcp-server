"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
var noteBase_exports = {};
__export(noteBase_exports, {
  NoteBaseExtension: () => NoteBaseExtension,
  NoteKind: () => NoteKind,
  name: () => name
});
module.exports = __toCommonJS(noteBase_exports);
var import_core = require("@tiptap/core");
var import_nodes = require("../nodes");
const name = "note";
var NoteKind = /* @__PURE__ */ ((NoteKind2) => {
  NoteKind2["Neutral"] = "neutral";
  NoteKind2["Dangerous"] = "dangerous";
  NoteKind2["DangerousLight"] = "dangerous-light";
  NoteKind2["Warning"] = "warning";
  NoteKind2["WarningLight"] = "warning-light";
  NoteKind2["Positive"] = "positive";
  NoteKind2["PositiveLight"] = "positive-light";
  NoteKind2["Primary"] = "primary";
  NoteKind2["PrimaryLight"] = "primary-light";
  return NoteKind2;
})(NoteKind || {});
const NoteBaseExtension = import_core.Mark.create({
  name,
  parseHTML() {
    return [
      {
        tag: `span[data-mark="${name}"]`
      }
    ];
  },
  renderHTML({ HTMLAttributes, mark }) {
    return [
      "span",
      { ...HTMLAttributes, "data-mark": this.name, class: `theme-text-editor-note-anchor ${mark.attrs.kind}` },
      0
    ];
  },
  addAttributes() {
    return {
      title: {
        default: null
      },
      kind: (0, import_nodes.getDataAttribute)("kind", { default: "neutral" /* Neutral */ })
    };
  }
});
//# sourceMappingURL=noteBase.js.map
