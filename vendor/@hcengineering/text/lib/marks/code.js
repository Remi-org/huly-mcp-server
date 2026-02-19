"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var code_exports = {};
__export(code_exports, {
  CodeExtension: () => CodeExtension,
  codeOptions: () => codeOptions
});
module.exports = __toCommonJS(code_exports);
var import_extension_code = __toESM(require("@tiptap/extension-code"));
var import_state = require("@tiptap/pm/state");
var import_prosemirror_codemark = __toESM(require("prosemirror-codemark"));
const codeOptions = {
  HTMLAttributes: {
    class: "proseCode"
  }
};
const CodeExtension = import_extension_code.default.extend({
  addProseMirrorPlugins() {
    return [
      ...(0, import_prosemirror_codemark.default)({ markType: this.editor.schema.marks.code }),
      new import_state.Plugin({
        key: new import_state.PluginKey("code-consecutive-backticks"),
        props: {
          // Typing a character inside of two backticks will wrap the character
          // in an inline code mark.
          handleTextInput: /* @__PURE__ */ __name((view, from, to, text) => {
            const { state } = view;
            if (from === 0 || to === state.doc.nodeSize - 1 || text === "`") {
              return false;
            }
            if (from === to && state.doc.textBetween(from - 1, from) === "`" && state.doc.textBetween(to, to + 1) === "`") {
              const start = from - 1;
              const end = to + 1;
              view.dispatch(
                state.tr.delete(start, end).insertText(text, start).addMark(start, start + text.length, state.schema.marks.code.create())
              );
              return true;
            }
            return false;
          }, "handleTextInput"),
          // Pasting a character inside of two backticks will wrap the character
          // in an inline code mark.
          handlePaste: /* @__PURE__ */ __name((view, _event, slice) => {
            const { state } = view;
            const { from, to } = state.selection;
            if (from === 0 || to === state.doc.nodeSize - 1) {
              return false;
            }
            const start = from - 1;
            const end = to + 1;
            if (from === to && state.doc.textBetween(start, from) === "`" && state.doc.textBetween(to, end) === "`") {
              view.dispatch(
                state.tr.replaceRange(start, end, slice).addMark(start, start + slice.size, state.schema.marks.code.create())
              );
              return true;
            }
            return false;
          }, "handlePaste")
        }
      })
    ];
  }
});
//# sourceMappingURL=code.js.map
