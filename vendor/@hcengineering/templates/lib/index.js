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
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  templateFieldRegexp: () => templateFieldRegexp,
  templatesId: () => templatesId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
const templateFieldRegexp = /\$\{(\S+?)}/gi;
const templatesId = "templates";
var index_default = (0, import_platform.plugin)(templatesId, {
  class: {
    MessageTemplate: "",
    TemplateCategory: "",
    TemplateField: "",
    TemplateFieldCategory: ""
  },
  component: {
    TemplatePopup: ""
  },
  string: {
    Template: ""
  },
  space: {
    Templates: ""
  },
  icon: {
    Templates: "",
    Template: "",
    Copy: ""
  },
  function: {
    GetTemplateDataProvider: ""
  }
});
//# sourceMappingURL=index.js.map
