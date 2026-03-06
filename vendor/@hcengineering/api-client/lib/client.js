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
var client_exports = {};
__export(client_exports, {
  connect: () => connect,
  getWorkspaceToken: () => getWorkspaceToken
});
module.exports = __toCommonJS(client_exports);
var import_client = __toESM(require("@hcengineering/client"));
var import_core = require("@hcengineering/core");
var import_platform = require("@hcengineering/platform");
var import_account = require("./account");
var import_config = require("./config");
var import_markup = require("./markup");
async function connect(url, options) {
  const config = await (0, import_config.loadServerConfig)(url);
  const { endpoint, token, workspaceId } = await getWorkspaceToken(url, options, config);
  return await createClient(url, endpoint, workspaceId, token, config, options);
}
__name(connect, "connect");
async function createClient(url, endpoint, workspaceId, token, config, options) {
  (0, import_platform.addLocation)(import_client.clientId, () => import(
    /* webpackChunkName: "client" */
    "@hcengineering/client-resources"
  ));
  const { socketFactory, connectionTimeout } = options;
  const clientFactory = await (0, import_platform.getResource)(import_client.default.function.GetClient);
  const connection = await clientFactory(token, endpoint, {
    socketFactory,
    connectionTimeout
  });
  const account = await connection.getAccount();
  return new PlatformClientImpl(url, workspaceId, token, config, connection, account);
}
__name(createClient, "createClient");
class PlatformClientImpl {
  constructor(url, workspace, token, config, connection, account) {
    this.url = url;
    this.workspace = workspace;
    this.token = token;
    this.config = config;
    this.connection = connection;
    this.account = account;
    this.client = new import_core.TxOperations(connection, account.primarySocialId || account._id);
    this.markup = (0, import_markup.createMarkupOperations)(url, workspace, token, config);
  }
  static {
    __name(this, "PlatformClientImpl");
  }
  client;
  markup;
  // Client
  getAccount() {
    return { ...this.account };
  }
  getHierarchy() {
    return this.client.getHierarchy();
  }
  getModel() {
    return this.client.getModel();
  }
  async findOne(_class, query, options) {
    return await this.client.findOne(_class, query, options);
  }
  async findAll(_class, query, options) {
    return await this.client.findAll(_class, query, options);
  }
  async close() {
    await this.connection.close();
  }
  async processMarkup(_class, id, data) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof import_markup.MarkupContent) {
        result[key] = this.markup.uploadMarkup(_class, id, key, value.content, value.kind);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  // DocOperations
  async createDoc(_class, space, attributes, id) {
    id ??= (0, import_core.generateId)();
    const data = await this.processMarkup(_class, id, attributes);
    return await this.client.createDoc(_class, space, data, id);
  }
  async updateDoc(_class, space, objectId, operations, retrieve) {
    const update = await this.processMarkup(_class, objectId, operations);
    return await this.client.updateDoc(_class, space, objectId, update, retrieve);
  }
  async removeDoc(_class, space, objectId) {
    return await this.client.removeDoc(_class, space, objectId);
  }
  // CollectionOperations
  async addCollection(_class, space, attachedTo, attachedToClass, collection, attributes, id) {
    id ??= (0, import_core.generateId)();
    const data = await this.processMarkup(_class, id, attributes);
    return await this.client.addCollection(_class, space, attachedTo, attachedToClass, collection, data, id);
  }
  async updateCollection(_class, space, objectId, attachedTo, attachedToClass, collection, operations, retrieve) {
    const update = await this.processMarkup(_class, objectId, operations);
    return await this.client.updateCollection(
      _class,
      space,
      objectId,
      attachedTo,
      attachedToClass,
      collection,
      update,
      retrieve
    );
  }
  async removeCollection(_class, space, objectId, attachedTo, attachedToClass, collection) {
    return await this.client.removeCollection(_class, space, objectId, attachedTo, attachedToClass, collection);
  }
  // MixinOperations
  async createMixin(objectId, objectClass, objectSpace, mixin, attributes) {
    const data = await this.processMarkup(objectClass, objectId, attributes);
    return await this.client.createMixin(objectId, objectClass, objectSpace, mixin, data);
  }
  async updateMixin(objectId, objectClass, objectSpace, mixin, attributes) {
    const update = await this.processMarkup(objectClass, objectId, attributes);
    return await this.client.updateMixin(objectId, objectClass, objectSpace, mixin, update);
  }
  // Markup
  async fetchMarkup(objectClass, objectId, objectAttr, markup, format) {
    return await this.markup.fetchMarkup(objectClass, objectId, objectAttr, markup, format);
  }
  async uploadMarkup(objectClass, objectId, objectAttr, markup, format) {
    return await this.markup.uploadMarkup(objectClass, objectId, objectAttr, markup, format);
  }
  // AsyncDisposable
  async [Symbol.asyncDispose]() {
    await this.close();
  }
}
async function getWorkspaceToken(url, options, config) {
  config ??= await (0, import_config.loadServerConfig)(url);
  let token;
  if ("token" in options) {
    token = options.token;
  } else {
    const { email, password, workspace } = options;
    token = await (0, import_account.login)(config.ACCOUNTS_URL, email, password, workspace);
  }
  if (token === void 0) {
    throw new Error("Login failed");
  }
  const ws = await (0, import_account.selectWorkspace)(config.ACCOUNTS_URL, token, options.workspace);
  if (ws === void 0) {
    throw new Error("Workspace not found");
  }
  return { endpoint: ws.endpoint, token: ws.token, workspaceId: ws.workspace ?? ws.workspaceId };
}
__name(getWorkspaceToken, "getWorkspaceToken");
//# sourceMappingURL=client.js.map
