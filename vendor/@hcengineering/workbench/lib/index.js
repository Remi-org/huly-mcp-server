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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  SidebarEvent: () => SidebarEvent,
  WidgetType: () => WidgetType,
  default: () => index_default,
  workbenchId: () => workbenchId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./analytics"), module.exports);
var WidgetType = /* @__PURE__ */ ((WidgetType2) => {
  WidgetType2["Fixed"] = "fixed";
  WidgetType2["Flexible"] = "flexible";
  WidgetType2["Configurable"] = "configurable ";
  return WidgetType2;
})(WidgetType || {});
var SidebarEvent = /* @__PURE__ */ ((SidebarEvent2) => {
  SidebarEvent2["OpenWidget"] = "openWidget";
  return SidebarEvent2;
})(SidebarEvent || {});
const workbenchId = "workbench";
var index_default = (0, import_platform.plugin)(workbenchId, {
  class: {
    Application: "",
    ApplicationNavModel: "",
    HiddenApplication: "",
    Widget: "",
    WidgetPreference: "",
    TxSidebarEvent: "",
    WorkbenchTab: ""
  },
  mixin: {
    SpaceView: ""
  },
  component: {
    WorkbenchApp: "",
    InviteLink: "",
    Archive: "",
    SpecialView: ""
  },
  string: {
    Archive: "",
    View: "",
    ServerUnderMaintenance: "",
    UpgradeDownloadProgress: "",
    OpenInSidebar: "",
    OpenInSidebarNewTab: "",
    ConfigureWidgets: "",
    WorkspaceIsArchived: "",
    WorkspaceIsMigrating: ""
  },
  icon: {
    Search: ""
  },
  event: {
    NotifyConnection: "",
    NotifyTitle: ""
  },
  metadata: {
    PlatformTitle: "",
    ExcludedApplications: "",
    DefaultApplication: "",
    DefaultSpace: "",
    DefaultSpecial: "",
    // Default for navigation expanded state
    NavigationExpandedDefault: ""
  },
  extensions: {
    WorkbenchExtensions: "",
    WorkbenchTabExtensions: "",
    SpecialViewAction: ""
  },
  function: {
    CreateWidgetTab: "",
    CloseWidgetTab: "",
    CloseWidget: "",
    GetSidebarObject: ""
  },
  actionImpl: {
    Navigate: ""
  }
});
//# sourceMappingURL=index.js.map
