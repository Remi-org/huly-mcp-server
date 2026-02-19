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
  createMarkupOperations: () => createMarkupOperations
});
module.exports = __toCommonJS(client_exports);
var import_core = require("@hcengineering/core");
var import_collaborator_client = require("@hcengineering/collaborator-client");
var import_text = require("@hcengineering/text");
function createMarkupOperations(url, workspace, token, config) {
  return new MarkupOperationsImpl(url, workspace, token, config);
}
__name(createMarkupOperations, "createMarkupOperations");
class MarkupOperationsImpl {
  constructor(url, workspace, token, config) {
    this.url = url;
    this.workspace = workspace;
    this.token = token;
    this.config = config;
    this.refUrl = (0, import_core.concatLink)(this.url, `/browse?workspace=${workspace}`);
    this.imageUrl = (0, import_core.concatLink)(this.url, `/files?workspace=${workspace}&file=`);
    this.collaborator = (0, import_collaborator_client.getClient)({ name: workspace }, token, config.COLLABORATOR_URL);
  }
  static {
    __name(this, "MarkupOperationsImpl");
  }
  collaborator;
  imageUrl;
  refUrl;
  async fetchMarkup(objectClass, objectId, objectAttr, doc, format) {
    const collabId = (0, import_core.makeCollabId)(objectClass, objectId, objectAttr);
    const markup = await this.collaborator.getMarkup(collabId, doc);
    switch (format) {
      case "markup":
        return markup;
      case "html":
        return (0, import_text.markupToHTML)(markup);
      case "markdown":
        return await (0, import_text.markupToMarkdown)(markup, this.refUrl, this.imageUrl);
      default:
        throw new Error("Unknown content format");
    }
  }
  async uploadMarkup(objectClass, objectId, objectAttr, value, format) {
    let markup = "";
    switch (format) {
      case "markup":
        markup = value;
        break;
      case "html":
        markup = (0, import_text.htmlToMarkup)(value);
        break;
      case "markdown":
        markup = (0, import_text.jsonToMarkup)((0, import_text.parseMessageMarkdown)(value, this.imageUrl, this.refUrl));
        break;
      default:
        throw new Error("Unknown content format");
    }
    const collabId = (0, import_core.makeCollabId)(objectClass, objectId, objectAttr);
    return await this.collaborator.createMarkup(collabId, markup);
  }
}
//# sourceMappingURL=client.js.map
