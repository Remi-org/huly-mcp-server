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
var import__ = require("..");
var import_classes = require("../classes");
var import_client = require("../client");
var import_component = __toESM(require("../component"));
var import_hierarchy = require("../hierarchy");
var import_memdb = require("../memdb");
var import_operations = require("../operations");
var import_tx = require("../tx");
var import_utils = require("../utils");
var import_connection = require("./connection");
var import_minmodel = require("./minmodel");
function filterPlugin(plugin) {
  return (txes) => {
    const configs = /* @__PURE__ */ new Map();
    (0, import_utils.fillConfiguration)(txes, configs);
    const excludedPlugins = Array.from(configs.values()).filter((it2) => !it2.enabled || it2.pluginId !== plugin);
    return (0, import_utils.pluginFilterTx)(excludedPlugins, configs, txes);
  };
}
__name(filterPlugin, "filterPlugin");
describe("client", () => {
  it("should create client and spaces", async () => {
    const klass = import_component.default.class.Space;
    const client = new import_operations.TxOperations(await (0, import_client.createClient)(import_connection.connect), import_component.default.account.System);
    const result = await client.findAll(klass, {});
    expect(result).toHaveLength(2);
    await client.createDoc(klass, import_component.default.space.Model, {
      private: false,
      name: "NewSpace",
      description: "",
      archived: false,
      members: []
    });
    const result2 = await client.findAll(klass, {});
    expect(result2).toHaveLength(3);
    await client.createDoc(klass, import_component.default.space.Model, {
      private: false,
      name: "NewSpace",
      description: "",
      members: [],
      archived: false
    });
    const result3 = await client.findAll(klass, {});
    expect(result3).toHaveLength(4);
    const result4 = await client.findOne(klass, {});
    expect(result4).toEqual(result3[0]);
  });
  it("should create client with plugins", async () => {
    const txFactory = new import_tx.TxFactory(import_component.default.account.System);
    const txes = (0, import_minmodel.genMinModel)();
    txes.push(
      txFactory.createTxCreateDoc(
        import_component.default.class.Class,
        import_component.default.space.Model,
        {
          label: "PluginConfiguration",
          extends: import_component.default.class.Doc,
          kind: import_classes.ClassifierKind.CLASS,
          domain: import_classes.DOMAIN_MODEL
        },
        import_component.default.class.PluginConfiguration
      )
    );
    async function connectPlugin(handler) {
      const hierarchy = new import_hierarchy.Hierarchy();
      for (const tx of txes) hierarchy.tx(tx);
      const transactions = new import_memdb.TxDb(hierarchy);
      const model = new import_memdb.ModelDb(hierarchy);
      for (const tx of txes) {
        await transactions.tx(tx);
        await model.tx(tx);
      }
      async function findAll(_class, query) {
        return await transactions.findAll(_class, query);
      }
      __name(findAll, "findAll");
      return new class {
        handler;
        set onConnect(handler2) {
          this.handler = handler2;
          void this.handler?.(import__.ClientConnectEvent.Connected, "", {});
        }
        get onConnect() {
          return this.handler;
        }
        isConnected = /* @__PURE__ */ __name(() => true, "isConnected");
        findAll = findAll;
        searchFulltext = /* @__PURE__ */ __name(async (query, options) => {
          return { docs: [] };
        }, "searchFulltext");
        tx = /* @__PURE__ */ __name(async (tx) => {
          if (tx.objectSpace === import_component.default.space.Model) {
            hierarchy.tx(tx);
          }
          const result = await Promise.all([transactions.tx(tx)]);
          return result[0];
        }, "tx");
        close = /* @__PURE__ */ __name(async () => {
        }, "close");
        loadChunk = /* @__PURE__ */ __name(async (domain, idx) => ({
          idx: -1,
          docs: [],
          finished: true
        }), "loadChunk");
        async getDomainHash(domain) {
          return (0, import_utils.generateId)();
        }
        async closeChunk(idx) {
        }
        async loadDocs(domain, docs) {
          return [];
        }
        async upload(domain, docs) {
        }
        async clean(domain, docs) {
        }
        async loadModel(last) {
          return txes;
        }
        async getAccount() {
          return null;
        }
        async sendForceClose() {
        }
      }();
    }
    __name(connectPlugin, "connectPlugin");
    const spyCreate = jest.spyOn(import_tx.TxProcessor, "createDoc2Doc");
    const spyUpdate = jest.spyOn(import_tx.TxProcessor, "updateDoc2Doc");
    const pluginData1 = {
      pluginId: "testPlugin1",
      transactions: [],
      beta: true,
      enabled: true
    };
    const txCreateDoc1 = txFactory.createTxCreateDoc(import_component.default.class.PluginConfiguration, import_component.default.space.Model, pluginData1);
    txes.push(txCreateDoc1);
    const client1 = new import_operations.TxOperations(
      await (0, import_client.createClient)(connectPlugin, filterPlugin("testPlugin1")),
      import_component.default.account.System
    );
    const result1 = await client1.findAll(import_component.default.class.PluginConfiguration, {});
    expect(result1).toHaveLength(1);
    expect(result1[0]._id).toStrictEqual(txCreateDoc1.objectId);
    expect(spyCreate).toHaveBeenLastCalledWith(txCreateDoc1, false);
    expect(spyUpdate).toHaveBeenCalledTimes(0);
    await client1.close();
    const pluginData2 = {
      pluginId: "testPlugin2",
      transactions: [],
      beta: true,
      enabled: true
    };
    const txCreateDoc2 = txFactory.createTxCreateDoc(import_component.default.class.PluginConfiguration, import_component.default.space.Model, pluginData2);
    txes.push(txCreateDoc2);
    const client2 = new import_operations.TxOperations(
      await (0, import_client.createClient)(connectPlugin, filterPlugin("testPlugin1")),
      import_component.default.account.System
    );
    const result2 = await client2.findAll(import_component.default.class.PluginConfiguration, {});
    expect(result2).toHaveLength(2);
    expect(result2[0]._id).toStrictEqual(txCreateDoc1.objectId);
    expect(result2[1]._id).toStrictEqual(txCreateDoc2.objectId);
    expect(spyCreate).toHaveBeenLastCalledWith(txCreateDoc2, false);
    expect(spyUpdate).toHaveBeenCalledTimes(0);
    await client2.close();
    const pluginData3 = {
      pluginId: "testPlugin3",
      transactions: [txCreateDoc1._id],
      beta: true,
      enabled: true
    };
    const txUpdateDoc = txFactory.createTxUpdateDoc(
      import_component.default.class.PluginConfiguration,
      import_component.default.space.Model,
      txCreateDoc1.objectId,
      pluginData3
    );
    txes.push(txUpdateDoc);
    const client3 = new import_operations.TxOperations(
      await (0, import_client.createClient)(connectPlugin, filterPlugin("testPlugin2")),
      import_component.default.account.System
    );
    const result3 = await client3.findAll(import_component.default.class.PluginConfiguration, {});
    expect(result3).toHaveLength(1);
    expect(result3[0]._id).toStrictEqual(txCreateDoc2.objectId);
    expect(spyCreate).toHaveBeenLastCalledWith(txCreateDoc2, false);
    expect(spyUpdate.mock.calls[1][1]).toStrictEqual(txUpdateDoc);
    expect(spyUpdate).toBeCalledTimes(2);
    await client3.close();
    spyCreate.mockReset();
    spyCreate.mockRestore();
    spyUpdate.mockReset();
    spyUpdate.mockRestore();
  });
});
//# sourceMappingURL=client.test.js.map
