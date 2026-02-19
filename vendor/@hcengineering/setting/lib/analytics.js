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
var analytics_exports = {};
__export(analytics_exports, {
  SettingsEvents: () => SettingsEvents
});
module.exports = __toCommonJS(analytics_exports);
var SettingsEvents = /* @__PURE__ */ ((SettingsEvents2) => {
  SettingsEvents2["SelectWorkspace"] = "settings.SelectWorkspace";
  SettingsEvents2["InviteToWorkspace"] = "settings.InviteToWorkspace";
  SettingsEvents2["SignOut"] = "settings.SignOut";
  return SettingsEvents2;
})(SettingsEvents || {});
//# sourceMappingURL=analytics.js.map
