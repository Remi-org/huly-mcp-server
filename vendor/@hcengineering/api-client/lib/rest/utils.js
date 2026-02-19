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
  extractJson: () => extractJson,
  withRetry: () => withRetry
});
module.exports = __toCommonJS(utils_exports);
var import_snappyjs = require("snappyjs");
async function withRetry(fn) {
  const maxRetries = 3;
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries - 1) {
        console.error("Failed to execute query", err);
        throw lastError;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
  throw lastError;
}
__name(withRetry, "withRetry");
function rpcJSONReceiver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "TotalArray") {
      return Object.assign(value.value, { total: value.total, lookupMap: value.lookupMap });
    }
  }
  return value;
}
__name(rpcJSONReceiver, "rpcJSONReceiver");
async function extractJson(response) {
  const encoding = response.headers.get("content-encoding");
  if (encoding === "snappy") {
    const buffer = await response.arrayBuffer();
    const decompressed = (0, import_snappyjs.uncompress)(buffer);
    const decoder = new TextDecoder();
    const jsonString2 = decoder.decode(decompressed);
    return JSON.parse(jsonString2, rpcJSONReceiver);
  }
  const jsonString = await response.text();
  return JSON.parse(jsonString, rpcJSONReceiver);
}
__name(extractJson, "extractJson");
//# sourceMappingURL=utils.js.map
