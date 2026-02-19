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
var config_exports = {};
__export(config_exports, {
  loadServerConfig: () => loadServerConfig
});
module.exports = __toCommonJS(config_exports);
var import_core = require("@hcengineering/core");
async function loadServerConfig(url) {
  const configUrl = (0, import_core.concatLink)(url, "/config.json");
  const res = await fetch(configUrl, { keepalive: true });
  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to fetch config");
}
__name(loadServerConfig, "loadServerConfig");
//# sourceMappingURL=config.js.map
