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
  calendarId: () => calendarId,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./utils"), module.exports);
const calendarId = "calendar";
const calendarPlugin = (0, import_platform.plugin)(calendarId, {
  class: {
    Calendar: "",
    ExternalCalendar: "",
    Event: "",
    ReccuringEvent: "",
    ReccuringInstance: ""
  },
  mixin: {
    CalendarEventPresenter: ""
  },
  icon: {
    Calendar: "",
    CalendarView: "",
    Location: "",
    Reminder: "",
    Notifications: "",
    Watch: "",
    Description: "",
    Participants: "",
    Repeat: "",
    Globe: "",
    Public: "",
    Hidden: "",
    Private: ""
  },
  image: {
    Permissions: ""
  },
  space: {
    Calendar: ""
  },
  app: {
    Calendar: ""
  },
  component: {
    CreateEvent: "",
    EditEvent: "",
    CalendarView: "",
    PersonsPresenter: "",
    Events: "",
    DateTimePresenter: "",
    DocReminder: "",
    ConnectApp: ""
  },
  string: {
    Title: "",
    Calendar: "",
    Description: "",
    Date: "",
    DueTo: "",
    Calendars: "",
    CreateCalendar: "",
    Location: "",
    Participants: "",
    NoParticipants: "",
    PersonsLabel: "",
    EventNumber: "",
    Reminders: "",
    Today: "",
    Visibility: "",
    Public: "",
    FreeBusy: "",
    Busy: "",
    Private: "",
    NotAllPermissions: ""
  },
  handler: {
    DisconnectHandler: ""
  },
  integrationType: {
    Calendar: ""
  },
  metadata: {
    CalendarServiceURL: ""
  },
  extensions: {
    EditEventExtensions: ""
  },
  ids: {
    ReminderNotification: "",
    NoAttached: ""
  }
});
var index_default = calendarPlugin;
//# sourceMappingURL=index.js.map
