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
var account_exports = {};
__export(account_exports, {
  login: () => login,
  selectWorkspace: () => selectWorkspace
});
module.exports = __toCommonJS(account_exports);
async function login(accountsUrl, user, password, workspace) {
  const response = await fetch(accountsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      method: "login",
      params: [user, password, workspace]
    })
  });
  const result = await response.json();
  return result.result?.token;
}
__name(login, "login");
async function selectWorkspace(accountsUrl, token, workspace) {
  const response = await fetch(accountsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      method: "selectWorkspace",
      params: [workspace, "external"]
    })
  });
  const result = await response.json();
  return result.result;
}
__name(selectWorkspace, "selectWorkspace");
//# sourceMappingURL=account.js.map
