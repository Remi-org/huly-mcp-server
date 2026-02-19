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
var rest_exports = {};
__export(rest_exports, {
  RestClientImpl: () => RestClientImpl,
  createRestClient: () => createRestClient
});
module.exports = __toCommonJS(rest_exports);
var import_core = require("@hcengineering/core");
var import_platform = require("@hcengineering/platform");
var import_utils = require("./utils");
function createRestClient(endpoint, workspaceId, token) {
  return new RestClientImpl(endpoint, workspaceId, token);
}
__name(createRestClient, "createRestClient");
class RestClientImpl {
  constructor(endpoint, workspace, token) {
    this.workspace = workspace;
    this.token = token;
    this.endpoint = endpoint.replace("ws", "http");
  }
  static {
    __name(this, "RestClientImpl");
  }
  endpoint;
  jsonHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
      "accept-encoding": "snappy, gzip"
    };
  }
  requestInit() {
    return {
      method: "GET",
      keepalive: true,
      headers: this.jsonHeaders()
    };
  }
  async findAll(_class, query, options) {
    const params = new URLSearchParams();
    params.append("class", _class);
    if (query !== void 0 && Object.keys(query).length > 0) {
      params.append("query", JSON.stringify(query));
    }
    if (options !== void 0 && Object.keys(options).length > 0) {
      params.append("options", JSON.stringify(options));
    }
    const requestUrl = (0, import_core.concatLink)(this.endpoint, `/api/v1/find-all/${this.workspace}?${params.toString()}`);
    const result = await (0, import_utils.withRetry)(async () => {
      const response = await fetch(requestUrl, this.requestInit());
      if (!response.ok) {
        throw new import_platform.PlatformError((0, import_platform.unknownError)(response.statusText));
      }
      return await (0, import_utils.extractJson)(response);
    });
    if (result.lookupMap !== void 0) {
      for (const d of result) {
        if (d.$lookup !== void 0) {
          for (const [k, v] of Object.entries(d.$lookup)) {
            if (!Array.isArray(v)) {
              d.$lookup[k] = result.lookupMap[v];
            } else {
              d.$lookup[k] = v.map((it) => result.lookupMap?.[it]);
            }
          }
        }
      }
      delete result.lookupMap;
    }
    for (const doc of result) {
      if (doc._class == null) {
        doc._class = _class;
      }
      for (const [k, v] of Object.entries(query)) {
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          if (doc[k] == null) {
            doc[k] = v;
          }
        }
      }
    }
    return result;
  }
  async getAccount() {
    const requestUrl = (0, import_core.concatLink)(this.endpoint, `/api/v1/account/${this.workspace}`);
    const response = await fetch(requestUrl, this.requestInit());
    if (!response.ok) {
      throw new import_platform.PlatformError((0, import_platform.unknownError)(response.statusText));
    }
    return await (0, import_utils.extractJson)(response);
  }
  async getModel() {
    const requestUrl = (0, import_core.concatLink)(this.endpoint, `/api/v1/load-model/${this.workspace}`);
    const response = await fetch(requestUrl, this.requestInit());
    if (!response.ok) {
      throw new import_platform.PlatformError((0, import_platform.unknownError)(response.statusText));
    }
    const modelResponse = await (0, import_utils.extractJson)(response);
    const hierarchy = new import_core.Hierarchy();
    const model = new import_core.ModelDb(hierarchy);
    const ctx = new import_core.MeasureMetricsContext("loadModel", {});
    (0, import_core.buildModel)(ctx, modelResponse, (txes) => txes, hierarchy, model);
    return { hierarchy, model };
  }
  async findOne(_class, query, options) {
    return (await this.findAll(_class, query, { ...options, limit: 1 })).shift();
  }
  async tx(tx) {
    const requestUrl = (0, import_core.concatLink)(this.endpoint, `/api/v1/tx/${this.workspace}`);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: this.jsonHeaders(),
      keepalive: true,
      body: JSON.stringify(tx)
    });
    if (!response.ok) {
      throw new import_platform.PlatformError((0, import_platform.unknownError)(response.statusText));
    }
    return await (0, import_utils.extractJson)(response);
  }
  async searchFulltext(query, options) {
    const params = new URLSearchParams();
    params.append("query", query.query);
    if (query.classes != null && Object.keys(query.classes).length > 0) {
      params.append("classes", JSON.stringify(query.classes));
    }
    if (query.spaces != null && Object.keys(query.spaces).length > 0) {
      params.append("spaces", JSON.stringify(query.spaces));
    }
    if (options.limit != null) {
      params.append("limit", `${options.limit}`);
    }
    const requestUrl = (0, import_core.concatLink)(this.endpoint, `/api/v1/search-fulltext/${this.workspace}`);
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: this.jsonHeaders(),
      keepalive: true
    });
    if (!response.ok) {
      throw new import_platform.PlatformError((0, import_platform.unknownError)(response.statusText));
    }
    return await (0, import_utils.extractJson)(response);
  }
}
//# sourceMappingURL=rest.js.map
