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
var image_exports = {};
__export(image_exports, {
  ImageNode: () => ImageNode
});
module.exports = __toCommonJS(image_exports);
var import_core = require("@tiptap/core");
var import_utils = require("./utils");
const ImageNode = import_core.Node.create({
  name: "image",
  addOptions() {
    return {
      inline: true,
      HTMLAttributes: {},
      getBlobRef: /* @__PURE__ */ __name(async () => ({ src: "", srcset: "" }), "getBlobRef")
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
      width: {
        default: null
      },
      height: {
        default: null
      },
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      },
      align: (0, import_utils.getDataAttribute)("align"),
      "data-file-type": {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `img[data-type="${this.name}"]`
      },
      {
        tag: "img[src]"
      }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const divAttributes = {
      class: "text-editor-image-container",
      "data-type": this.name,
      "data-align": node.attrs.align
    };
    const imgAttributes = (0, import_core.mergeAttributes)(
      {
        "data-type": this.name
      },
      this.options.HTMLAttributes,
      HTMLAttributes
    );
    const fileId = imgAttributes["file-id"];
    if (fileId != null) {
      imgAttributes.src = `platform://platform/files/workspace/?file=${fileId}`;
    }
    return ["div", divAttributes, ["img", imgAttributes]];
  },
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const container = document.createElement("div");
      const imgElement = document.createElement("img");
      container.append(imgElement);
      const divAttributes = {
        class: "text-editor-image-container",
        "data-type": this.name,
        "data-align": node.attrs.align
      };
      for (const [k, v] of Object.entries(divAttributes)) {
        if (v !== null) {
          container.setAttribute(k, v);
        }
      }
      const imgAttributes = (0, import_core.mergeAttributes)(
        {
          "data-type": this.name
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      );
      for (const [k, v] of Object.entries(imgAttributes)) {
        if (k !== "src" && k !== "srcset" && v !== null) {
          imgElement.setAttribute(k, v);
        }
      }
      const fileId = imgAttributes["file-id"];
      if (fileId != null) {
        const setBrokenImg = setTimeout(() => {
          imgElement.src = this.options.loadingImgSrc ?? `platform://platform/files/workspace/?file=${fileId}`;
        }, 500);
        if (fileId != null) {
          void this.options.getBlobRef(fileId).then((val) => {
            clearTimeout(setBrokenImg);
            imgElement.src = val.src;
            imgElement.srcset = val.srcset;
          });
        }
      } else {
        if (imgAttributes.srcset != null) {
          imgElement.srcset = imgAttributes.srcset;
        }
        if (imgAttributes.src != null) {
          imgElement.src = imgAttributes.src;
        }
      }
      return {
        dom: container
      };
    };
  }
});
//# sourceMappingURL=image.js.map
