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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  ToDoPriority: () => ToDoPriority,
  default: () => index_default,
  timeId: () => timeId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./analytics"), module.exports);
const timeId = "time";
var ToDoPriority = /* @__PURE__ */ ((ToDoPriority2) => {
  ToDoPriority2[ToDoPriority2["High"] = 0] = "High";
  ToDoPriority2[ToDoPriority2["Medium"] = 1] = "Medium";
  ToDoPriority2[ToDoPriority2["Low"] = 2] = "Low";
  ToDoPriority2[ToDoPriority2["NoPriority"] = 3] = "NoPriority";
  ToDoPriority2[ToDoPriority2["Urgent"] = 4] = "Urgent";
  return ToDoPriority2;
})(ToDoPriority || {});
var index_default = (0, import_platform.plugin)(timeId, {
  component: {
    Me: "",
    Team: "",
    EditToDo: ""
  },
  class: {
    WorkSlot: "",
    ToDo: "",
    ProjectToDo: "",
    TypeToDoPriority: "",
    TodoAutomationHelper: ""
  },
  mixin: {
    ItemPresenter: ""
  },
  ids: {
    NotAttached: ""
  },
  space: {
    ToDos: ""
  },
  icon: {
    Team: "",
    Hashtag: "",
    Inbox: "",
    Calendar: "",
    Flag: "",
    FilledFlag: "",
    Planned: "",
    All: ""
  },
  string: {
    Planner: "",
    Calendar: "",
    Agenda: "",
    Me: "",
    Team: "",
    WeekCalendar: "",
    DayCalendar: "",
    CreatedToDo: "",
    AddToDo: "",
    NewToDoDetails: "",
    ToDo: "",
    NewToDo: ""
  }
});
//# sourceMappingURL=index.js.map
