"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  coreId: () => import_component.coreId,
  default: () => import_component.default,
  systemAccountEmail: () => import_component.systemAccountEmail
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("./classes"), module.exports);
__reExport(index_exports, require("./client"), module.exports);
__reExport(index_exports, require("./collaboration"), module.exports);
var import_component = __toESM(require("./component"));
__reExport(index_exports, require("./hierarchy"), module.exports);
__reExport(index_exports, require("./measurements"), module.exports);
__reExport(index_exports, require("./memdb"), module.exports);
__reExport(index_exports, require("./objvalue"), module.exports);
__reExport(index_exports, require("./operations"), module.exports);
__reExport(index_exports, require("./operator"), module.exports);
__reExport(index_exports, require("./query"), module.exports);
__reExport(index_exports, require("./server"), module.exports);
__reExport(index_exports, require("./storage"), module.exports);
__reExport(index_exports, require("./tx"), module.exports);
__reExport(index_exports, require("./utils"), module.exports);
__reExport(index_exports, require("./backup"), module.exports);
__reExport(index_exports, require("./status"), module.exports);
__reExport(index_exports, require("./clone"), module.exports);
__reExport(index_exports, require("./common"), module.exports);
__reExport(index_exports, require("./time"), module.exports);
__reExport(index_exports, require("./benchmark"), module.exports);
//# sourceMappingURL=index.js.map
