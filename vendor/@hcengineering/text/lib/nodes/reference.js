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
var reference_exports = {};
__export(reference_exports, {
  ReferenceNode: () => ReferenceNode
});
module.exports = __toCommonJS(reference_exports);
var import_core = require("@tiptap/core");
var import_utils = require("./utils");
const ReferenceNode = import_core.Node.create({
  name: "reference",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      id: (0, import_utils.getDataAttribute)("id"),
      objectclass: (0, import_utils.getDataAttribute)("objectclass"),
      label: (0, import_utils.getDataAttribute)("label")
    };
  },
  addOptions() {
    return {
      renderLabel({ options, props }) {
        return `${options.suggestion.char}${props.label ?? props.id}`;
      },
      suggestion: { char: "@" },
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
        getAttrs: /* @__PURE__ */ __name((el) => {
          const id = el.getAttribute("id")?.trim();
          const label = el.getAttribute("label")?.trim();
          const objectclass = el.getAttribute("objectclass")?.trim();
          if (id == null || label == null || objectclass == null) {
            return false;
          }
          return {
            id,
            label,
            objectclass
          };
        }, "getAttrs")
      }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      (0, import_core.mergeAttributes)(
        {
          "data-type": this.name,
          class: "antiMention"
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        props: node.attrs
      })
    ];
  },
  renderText({ node }) {
    const options = this.options;
    return options.renderLabel({ options, props: node.attrs });
  }
});
//# sourceMappingURL=reference.js.map
