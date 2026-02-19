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
var file_exports = {};
__export(file_exports, {
  FileNode: () => FileNode
});
module.exports = __toCommonJS(file_exports);
var import_core = require("@tiptap/core");
const FileNode = import_core.Node.create({
  name: "file",
  addOptions() {
    return {
      inline: true,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      "file-id": {
        default: null
      },
      "data-file-name": {
        default: null
      },
      "data-file-size": {
        default: null
      },
      "data-file-type": {
        default: null
      },
      "data-file-href": {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const nodeAttributes = {
      "data-type": this.name
    };
    const fileName = HTMLAttributes["data-file-name"];
    const size = HTMLAttributes["data-file-size"];
    const fileType = HTMLAttributes["data-file-type"];
    const href = HTMLAttributes["data-file-href"];
    const linkAttributes = {
      class: "file-name",
      href,
      type: fileType,
      download: fileName,
      target: "_blank"
    };
    return [
      "div",
      nodeAttributes,
      ["div", {}, ["a", linkAttributes, `${fileName} (${fileType})`]],
      ["div", {}, `${size}`]
    ];
  }
});
//# sourceMappingURL=file.js.map
