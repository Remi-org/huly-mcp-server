"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_platform = __toESM(require("../platform"));
var import_status = require("../status");
var import_i18n = require("../i18n");
var import_event = require("../event");
const testId = "test-strings";
const test = (0, import_platform.plugin)(testId, {
  string: {
    loadingPlugin: ""
  }
});
describe("i18n", () => {
  it("should translate string", async () => {
    (0, import_i18n.addStringsLoader)(testId, async (locale) => await import(`./lang/${locale}.json`));
    const translated = await (0, import_i18n.translate)(test.string.loadingPlugin, { plugin: "xxx" });
    expect(translated).toBe("Loading plugin <b>xxx</b>...");
  });
  it("should return id when no translation found", async () => {
    const id = testId + ".inexistent";
    const inexistent = await (0, import_i18n.translate)(id, {});
    expect(inexistent).toBe(id);
  });
  it("should cache translated string", async () => {
    const translated = await (0, import_i18n.translate)(test.string.loadingPlugin, { plugin: "xxx" });
    expect(translated).toBe("Loading plugin <b>xxx</b>...");
  });
  it("should emit status and return id when no loader", async () => {
    expect.assertions(2);
    const plugin2 = "plugin-without-string-loader";
    const message = `${plugin2}:string:id`;
    const checkStatus = new import_status.Status(import_status.Severity.ERROR, import_platform.default.status.NoLoaderForStrings, { plugin: plugin2 });
    const eventListener = /* @__PURE__ */ __name(async (event, data) => {
      expect(data).toEqual(checkStatus);
    }, "eventListener");
    (0, import_event.addEventListener)(import_event.PlatformEvent, eventListener);
    const translated = await (0, import_i18n.translate)(message, {});
    expect(translated).toBe(message);
    (0, import_event.removeEventListener)(import_event.PlatformEvent, eventListener);
  });
  it("should emit status and return id when bad loader", async () => {
    expect.assertions(2);
    const plugin2 = "component-for-bad-loader";
    const message = `${plugin2}:string:id`;
    const errorMessage = "bad loader";
    (0, import_i18n.addStringsLoader)(plugin2, (locale) => {
      throw new Error(errorMessage);
    });
    const checkStatus = new import_status.Status(import_status.Severity.ERROR, import_platform.default.status.UnknownError, { message: errorMessage });
    const eventListener = /* @__PURE__ */ __name(async (event, data) => {
      expect(data).toEqual(checkStatus);
    }, "eventListener");
    (0, import_event.addEventListener)(import_event.PlatformEvent, eventListener);
    const translated = await (0, import_i18n.translate)(message, {});
    expect(translated).toBe(message);
    (0, import_event.removeEventListener)(import_event.PlatformEvent, eventListener);
  });
  it("should cache error", async () => {
    const plugin2 = "component";
    const message = `${plugin2}:string:id`;
    const checkStatus = new import_status.Status(import_status.Severity.ERROR, import_platform.default.status.NoLoaderForStrings, { plugin: plugin2 });
    let calls = 0;
    const eventListener = /* @__PURE__ */ __name(async (event, data) => {
      ++calls;
      expect(data).toEqual(checkStatus);
    }, "eventListener");
    (0, import_event.addEventListener)(import_event.PlatformEvent, eventListener);
    const t1 = await (0, import_i18n.translate)(message, {});
    const t2 = await (0, import_i18n.translate)(message, {});
    expect(t1).toBe(t2);
    (0, import_event.removeEventListener)(import_event.PlatformEvent, eventListener);
    expect(calls).toBe(1);
  });
  it("should return message when bad id", async () => {
    expect.assertions(2);
    const message = "testMessage";
    const checkStatus = new import_status.Status(import_status.Severity.ERROR, import_platform.default.status.InvalidId, { id: message });
    const eventListener = /* @__PURE__ */ __name(async (event, data) => {
      expect(data).toEqual(checkStatus);
    }, "eventListener");
    (0, import_event.addEventListener)(import_event.PlatformEvent, eventListener);
    const translated = await (0, import_i18n.translate)(message, {});
    expect(translated).toBe(message);
    (0, import_event.removeEventListener)(import_event.PlatformEvent, eventListener);
  });
});
//# sourceMappingURL=i18n.test.js.map
