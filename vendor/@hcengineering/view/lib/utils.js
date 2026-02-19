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
var utils_exports = {};
__export(utils_exports, {
  decodeObjectURI: () => decodeObjectURI,
  encodeObjectURI: () => encodeObjectURI
});
module.exports = __toCommonJS(utils_exports);
function decodeObjectURI(value) {
  return decodeURIComponent(value).split("|");
}
__name(decodeObjectURI, "decodeObjectURI");
function encodeObjectURI(_id, _class) {
  return [_id, _class].join("|");
}
__name(encodeObjectURI, "encodeObjectURI");
//# sourceMappingURL=utils.js.map
