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
var classes_exports = {};
__export(classes_exports, {
  AccountRole: () => AccountRole,
  ClassifierKind: () => ClassifierKind,
  DOMAIN_BLOB: () => DOMAIN_BLOB,
  DOMAIN_CONFIGURATION: () => DOMAIN_CONFIGURATION,
  DOMAIN_DOC_INDEX_STATE: () => DOMAIN_DOC_INDEX_STATE,
  DOMAIN_MIGRATION: () => DOMAIN_MIGRATION,
  DOMAIN_MODEL: () => DOMAIN_MODEL,
  DOMAIN_MODEL_TX: () => DOMAIN_MODEL_TX,
  DOMAIN_RELATION: () => DOMAIN_RELATION,
  DOMAIN_SEQUENCE: () => DOMAIN_SEQUENCE,
  DOMAIN_SPACE: () => DOMAIN_SPACE,
  DOMAIN_TRANSIENT: () => DOMAIN_TRANSIENT,
  DateRangeMode: () => DateRangeMode,
  IndexKind: () => IndexKind,
  IndexOrder: () => IndexOrder,
  isActiveMode: () => isActiveMode,
  isArchivingMode: () => isArchivingMode,
  isDeletingMode: () => isDeletingMode,
  isMigrationMode: () => isMigrationMode,
  isRestoringMode: () => isRestoringMode,
  isUpgradingMode: () => isUpgradingMode,
  roleOrder: () => roleOrder,
  versionToString: () => versionToString
});
module.exports = __toCommonJS(classes_exports);
var IndexKind = /* @__PURE__ */ ((IndexKind2) => {
  IndexKind2[IndexKind2["FullText"] = 0] = "FullText";
  IndexKind2[IndexKind2["Indexed"] = 1] = "Indexed";
  IndexKind2[IndexKind2["IndexedDsc"] = 2] = "IndexedDsc";
  return IndexKind2;
})(IndexKind || {});
var ClassifierKind = /* @__PURE__ */ ((ClassifierKind2) => {
  ClassifierKind2[ClassifierKind2["CLASS"] = 0] = "CLASS";
  ClassifierKind2[ClassifierKind2["INTERFACE"] = 1] = "INTERFACE";
  ClassifierKind2[ClassifierKind2["MIXIN"] = 2] = "MIXIN";
  return ClassifierKind2;
})(ClassifierKind || {});
var DateRangeMode = /* @__PURE__ */ ((DateRangeMode2) => {
  DateRangeMode2["DATE"] = "date";
  DateRangeMode2["TIME"] = "time";
  DateRangeMode2["DATETIME"] = "datetime";
  DateRangeMode2["TIMEONLY"] = "timeonly";
  return DateRangeMode2;
})(DateRangeMode || {});
const DOMAIN_MODEL = "model";
const DOMAIN_MODEL_TX = "model_tx";
const DOMAIN_SPACE = "space";
const DOMAIN_CONFIGURATION = "_configuration";
const DOMAIN_MIGRATION = "_migrations";
const DOMAIN_TRANSIENT = "transient";
const DOMAIN_RELATION = "relation";
const DOMAIN_BLOB = "blob";
const DOMAIN_DOC_INDEX_STATE = "doc-index-state";
const DOMAIN_SEQUENCE = "sequence";
var AccountRole = /* @__PURE__ */ ((AccountRole2) => {
  AccountRole2["DocGuest"] = "DocGuest";
  AccountRole2["Guest"] = "GUEST";
  AccountRole2["User"] = "USER";
  AccountRole2["Maintainer"] = "MAINTAINER";
  AccountRole2["Owner"] = "OWNER";
  return AccountRole2;
})(AccountRole || {});
const roleOrder = {
  ["DocGuest" /* DocGuest */]: 0,
  ["GUEST" /* Guest */]: 1,
  ["USER" /* User */]: 2,
  ["MAINTAINER" /* Maintainer */]: 3,
  ["OWNER" /* Owner */]: 4
};
function versionToString(version) {
  return `${version?.major}.${version?.minor}.${version?.patch}`;
}
__name(versionToString, "versionToString");
var IndexOrder = /* @__PURE__ */ ((IndexOrder2) => {
  IndexOrder2[IndexOrder2["Ascending"] = 1] = "Ascending";
  IndexOrder2[IndexOrder2["Descending"] = -1] = "Descending";
  return IndexOrder2;
})(IndexOrder || {});
function isActiveMode(mode) {
  return mode === "active";
}
__name(isActiveMode, "isActiveMode");
function isDeletingMode(mode) {
  return mode === "pending-deletion" || mode === "deleting" || mode === "deleted";
}
__name(isDeletingMode, "isDeletingMode");
function isArchivingMode(mode) {
  return mode === "archiving-pending-backup" || mode === "archiving-backup" || mode === "archiving-pending-clean" || mode === "archiving-clean" || mode === "archived";
}
__name(isArchivingMode, "isArchivingMode");
function isMigrationMode(mode) {
  return mode === "migration-pending-backup" || mode === "migration-backup" || mode === "migration-pending-clean" || mode === "migration-clean";
}
__name(isMigrationMode, "isMigrationMode");
function isRestoringMode(mode) {
  return mode === "restoring" || mode === "pending-restore";
}
__name(isRestoringMode, "isRestoringMode");
function isUpgradingMode(mode) {
  return mode === "upgrading";
}
__name(isUpgradingMode, "isUpgradingMode");
//# sourceMappingURL=classes.js.map
