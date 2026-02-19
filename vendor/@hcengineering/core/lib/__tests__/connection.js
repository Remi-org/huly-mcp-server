"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var connection_exports = {};
__export(connection_exports, {
  connect: () => connect
});
module.exports = __toCommonJS(connection_exports);
var import__ = require("..");
var import_component = __toESM(require("../component"));
var import_hierarchy = require("../hierarchy");
var import_memdb = require("../memdb");
var import_tx = require("../tx");
var import_minmodel = require("./minmodel");
async function connect(handler) {
  const txes = (0, import_minmodel.genMinModel)();
  const hierarchy = new import_hierarchy.Hierarchy();
  for (const tx of txes) hierarchy.tx(tx);
  const transactions = new import_memdb.TxDb(hierarchy);
  const model = new import_memdb.ModelDb(hierarchy);
  for (const tx of txes) {
    await transactions.tx(tx);
    await model.tx(tx);
  }
  async function findAll(_class, query) {
    const domain = hierarchy.getClass(_class).domain;
    if (domain === import_tx.DOMAIN_TX) return await transactions.findAll(_class, query);
    return await model.findAll(_class, query);
  }
  __name(findAll, "findAll");
  class ClientConnectionImpl {
    static {
      __name(this, "ClientConnectionImpl");
    }
    isConnected = /* @__PURE__ */ __name(() => true, "isConnected");
    findAll = findAll;
    handler;
    set onConnect(handler2) {
      this.handler = handler2;
      void this.handler?.(import__.ClientConnectEvent.Connected, "", {});
    }
    get onConnect() {
      return this.handler;
    }
    async searchFulltext(query, options) {
      return { docs: [] };
    }
    async tx(tx) {
      if (tx.objectSpace === import_component.default.space.Model) {
        hierarchy.tx(tx);
      }
      const result = await Promise.all([model.tx(tx), transactions.tx(tx)]);
      return result[0];
    }
    async close() {
    }
    async loadChunk(domain, idx) {
      return {
        idx: -1,
        docs: [],
        finished: true
      };
    }
    async getDomainHash(domain) {
      return (0, import__.generateId)();
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
  }
  return new ClientConnectionImpl();
}
__name(connect, "connect");
//# sourceMappingURL=connection.js.map
