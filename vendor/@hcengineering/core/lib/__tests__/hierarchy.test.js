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
var import_component = __toESM(require("../component"));
var import_hierarchy = require("../hierarchy");
var Proxy2 = __toESM(require("../proxy"));
var import_minmodel = require("./minmodel");
const txes = (0, import_minmodel.genMinModel)();
function prepare() {
  const hierarchy = new import_hierarchy.Hierarchy();
  for (const tx of txes) hierarchy.tx(tx);
  return hierarchy;
}
__name(prepare, "prepare");
describe("hierarchy", () => {
  it("should build hierarchy", async () => {
    const hierarchy = prepare();
    const ancestors = hierarchy.getAncestors(import_component.default.class.TxCreateDoc);
    expect(ancestors).toContain(import_component.default.class.Tx);
  });
  it("isDerived", async () => {
    const hierarchy = prepare();
    const derived = hierarchy.isDerived(import_component.default.class.Space, import_component.default.class.Doc);
    expect(derived).toBeTruthy();
    const notDerived = hierarchy.isDerived(import_component.default.class.Space, import_component.default.class.Class);
    expect(notDerived).not.toBeTruthy();
  });
  it("isImplements", async () => {
    const hierarchy = prepare();
    let isImplements = hierarchy.isImplements(import_minmodel.test.class.Task, import_minmodel.test.interface.WithState);
    expect(isImplements).toBeTruthy();
    isImplements = hierarchy.isImplements(import_minmodel.test.class.TaskCheckItem, import_minmodel.test.interface.WithState);
    expect(isImplements).toBeTruthy();
    const notImplements = hierarchy.isImplements(import_component.default.class.Space, import_minmodel.test.interface.WithState);
    expect(notImplements).not.toBeTruthy();
  });
  it("getClass", async () => {
    const hierarchy = prepare();
    const data = hierarchy.getClass(import_component.default.class.TxCreateDoc);
    expect(data).toMatchObject(txes.find((p) => p.objectId === import_component.default.class.TxCreateDoc).attributes);
    const notExistClass = "class:test.MyClass";
    expect(() => hierarchy.getClass(notExistClass)).toThrowError("class not found: " + notExistClass);
  });
  it("getDomain", async () => {
    const hierarchy = prepare();
    const txDomain = hierarchy.getDomain(import_component.default.class.TxCreateDoc);
    expect(txDomain).toBe("tx");
    const modelDomain = hierarchy.getDomain(import_component.default.class.Class);
    expect(modelDomain).toBe("model");
  });
  it("should create Mixin proxy", async () => {
    const spyProxy = jest.spyOn(Proxy2, "_createMixinProxy");
    const hierarchy = prepare();
    hierarchy.as(txes[0], import_minmodel.test.mixin.TestMixin);
    expect(spyProxy).toBeCalledTimes(1);
    hierarchy.as(txes[0], import_minmodel.test.mixin.TestMixin);
    expect(spyProxy).toBeCalledTimes(1);
    spyProxy.mockReset();
    spyProxy.mockRestore();
  });
  it("should call static methods", async () => {
    const spyToDoc = jest.spyOn(Proxy2, "_toDoc");
    import_hierarchy.Hierarchy.toDoc(txes[0]);
    expect(spyToDoc).toBeCalledTimes(1);
    spyToDoc.mockReset();
    spyToDoc.mockRestore();
    const spyMixinClass = jest.spyOn(Proxy2, "_mixinClass");
    import_hierarchy.Hierarchy.mixinClass(txes[0]);
    expect(spyMixinClass).toBeCalledTimes(1);
    spyMixinClass.mockImplementationOnce(() => void 0).mockImplementationOnce(() => import_minmodel.test.mixin.TestMixin);
    let result = import_hierarchy.Hierarchy.mixinOrClass(txes[0]);
    expect(result).toStrictEqual(txes[0]._class);
    result = import_hierarchy.Hierarchy.mixinOrClass(txes[0]);
    expect(result).toStrictEqual(import_minmodel.test.mixin.TestMixin);
    expect(spyMixinClass).toBeCalledTimes(3);
    spyMixinClass.mockReset();
    spyMixinClass.mockRestore();
  });
});
//# sourceMappingURL=hierarchy.test.js.map
