"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var analytics_exports = {};
__export(analytics_exports, {
  TimeEvents: () => TimeEvents
});
module.exports = __toCommonJS(analytics_exports);
var TimeEvents = /* @__PURE__ */ ((TimeEvents2) => {
  TimeEvents2["TeamOpenTab"] = "time.team.OpenTab";
  TimeEvents2["ToDoCreated"] = "time.todo.Created";
  TimeEvents2["ToDoScheduled"] = "time.todo.Scheduled";
  return TimeEvents2;
})(TimeEvents || {});
//# sourceMappingURL=analytics.js.map
