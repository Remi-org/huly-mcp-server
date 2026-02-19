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
var client_exports = {};
__export(client_exports, {
  getClient: () => getClient
});
module.exports = __toCommonJS(client_exports);
var import_core = require("@hcengineering/core");
var import_utils = require("./utils");
function getClient(workspaceId, token, collaboratorUrl) {
  const url = collaboratorUrl.replaceAll("wss://", "https://").replace("ws://", "http://");
  return new CollaboratorClientImpl(workspaceId, token, url);
}
__name(getClient, "getClient");
class CollaboratorClientImpl {
  constructor(workspace, token, collaboratorUrl) {
    this.workspace = workspace;
    this.token = token;
    this.collaboratorUrl = collaboratorUrl;
  }
  static {
    __name(this, "CollaboratorClientImpl");
  }
  async rpc(document, method, payload) {
    const workspace = this.workspace.name;
    const documentId = (0, import_utils.encodeDocumentId)(workspace, document);
    const url = (0, import_core.concatLink)(this.collaboratorUrl, `/rpc/${encodeURIComponent(documentId)}`);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ method, payload })
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const result = await res.json();
    if (result.error != null) {
      throw new Error(result.error);
    }
    return result;
  }
  async getMarkup(document, source) {
    const payload = {
      source: source !== null ? source : void 0
    };
    const res = await retry(
      3,
      async () => {
        return await this.rpc(document, "getContent", payload);
      },
      50
    );
    return res.content[document.objectAttr] ?? "";
  }
  async createMarkup(document, markup) {
    const content = {
      [document.objectAttr]: markup
    };
    const res = await retry(
      3,
      async () => {
        return await this.rpc(document, "createContent", { content });
      },
      50
    );
    return res.content[document.objectAttr];
  }
  async updateMarkup(document, markup) {
    const content = {
      [document.objectAttr]: markup
    };
    await retry(
      3,
      async () => {
        await this.rpc(document, "updateContent", { content });
      },
      50
    );
  }
  async copyContent(source, target, content) {
    const markup = await this.getMarkup(source, content);
    await this.updateMarkup(target, markup);
  }
}
async function retry(retries, op, delay = 100) {
  let error;
  while (retries > 0) {
    retries--;
    try {
      return await op();
    } catch (err) {
      error = err;
      if (retries !== 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw error;
}
__name(retry, "retry");
//# sourceMappingURL=client.js.map
