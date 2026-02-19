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
var tx_exports = {};
__export(tx_exports, {
  createRestTxOperations: () => createRestTxOperations
});
module.exports = __toCommonJS(tx_exports);
var import_core = require("@hcengineering/core");
var import_rest = require("./rest");
async function createRestTxOperations(endpoint, workspaceId, token) {
  const restClient = new import_rest.RestClientImpl(endpoint, workspaceId, token);
  const account = await restClient.getAccount();
  const { hierarchy, model } = await restClient.getModel();
  return new import_core.TxOperations(new RestTxClient(restClient, hierarchy, model, account), account._id);
}
__name(createRestTxOperations, "createRestTxOperations");
class RestTxClient {
  constructor(client, hierarchy, model, account) {
    this.client = client;
    this.hierarchy = hierarchy;
    this.model = model;
    this.account = account;
  }
  static {
    __name(this, "RestTxClient");
  }
  close() {
    return Promise.resolve();
  }
  async findAll(_class, query, options) {
    const data = await this.client.findAll(_class, query, options);
    const result = data.map((v) => {
      return this.hierarchy.updateLookupMixin(_class, v, options);
    });
    return (0, import_core.toFindResult)(result, data.total);
  }
  async findOne(_class, query, options) {
    const v = await this.client.findOne(_class, query, options);
    if (v === void 0) {
      return;
    }
    return this.hierarchy.updateLookupMixin(_class, v, options);
  }
  getHierarchy = /* @__PURE__ */ __name(() => this.hierarchy, "getHierarchy");
  getModel = /* @__PURE__ */ __name(() => this.model, "getModel");
  async getAccount() {
    return this.account;
  }
  async tx(tx) {
    return await this.client.tx(tx);
  }
  async searchFulltext(query, options) {
    return await this.client.searchFulltext(query, options);
  }
}
//# sourceMappingURL=tx.js.map
