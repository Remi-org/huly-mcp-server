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
var colors_exports = {};
__export(colors_exports, {
  BackgroundColor: () => BackgroundColor,
  TextColor: () => TextColor
});
module.exports = __toCommonJS(colors_exports);
var import_core = require("@tiptap/core");
var import_extension_text_style = require("@tiptap/extension-text-style");
const BackgroundColor = import_core.Extension.create({
  name: "backgroundColor",
  addOptions() {
    return {
      types: []
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            parseHTML: /* @__PURE__ */ __name((element) => {
              return element.getAttribute("data-background-color") ?? void 0;
            }, "parseHTML"),
            renderHTML: /* @__PURE__ */ __name((attributes) => {
              if (typeof attributes.backgroundColor !== "string") {
                return {};
              }
              return {
                "data-background-color": attributes.backgroundColor,
                style: `background-color: ${attributes.backgroundColor}`
              };
            }, "renderHTML")
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setBackgroundColor: /* @__PURE__ */ __name((backgroundColor) => ({ commands }) => {
        return this.options.types.map((type) => commands.updateAttributes(type, { backgroundColor })).every((response) => response);
      }, "setBackgroundColor"),
      unsetBackgroundColor: /* @__PURE__ */ __name(() => ({ commands }) => {
        return this.options.types.map((type) => commands.resetAttributes(type, "backgroundColor")).every((response) => response);
      }, "unsetBackgroundColor")
    };
  }
});
const TextColor = import_core.Extension.create({
  name: "textColor",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            parseHTML: /* @__PURE__ */ __name((element) => {
              return element.getAttribute("data-color") ?? void 0;
            }, "parseHTML"),
            renderHTML: /* @__PURE__ */ __name((attributes) => {
              if (typeof attributes.color !== "string") {
                return {};
              }
              return {
                "data-color": attributes.color,
                style: `color: ${attributes.color}`
              };
            }, "renderHTML")
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setTextColor: /* @__PURE__ */ __name((color) => ({ chain }) => {
        return chain().setMark("textStyle", { color }).run();
      }, "setTextColor"),
      unsetTextColor: /* @__PURE__ */ __name(() => ({ chain }) => {
        return chain().unsetMark("textStyle").run();
      }, "unsetTextColor")
    };
  }
});
//# sourceMappingURL=colors.js.map
