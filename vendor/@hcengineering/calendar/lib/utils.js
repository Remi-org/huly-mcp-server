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
var utils_exports = {};
__export(utils_exports, {
  generateEventId: () => generateEventId,
  getAllEvents: () => getAllEvents,
  getWeekday: () => getWeekday
});
module.exports = __toCommonJS(utils_exports);
var import_core = require("@hcengineering/core");
var import__ = __toESM(require("."));
function getInstance(event, date) {
  const diff = event.dueDate - event.date;
  return {
    ...event,
    recurringEventId: event.eventId,
    date,
    dueDate: date + diff,
    originalStartTime: date,
    _class: import__.default.class.ReccuringInstance,
    eventId: generateEventId(),
    _id: (0, import_core.generateId)(),
    virtual: true
  };
}
__name(getInstance, "getInstance");
function generateRecurringValues(rule, startDate, from, to) {
  const values = [];
  const currentDate = new Date(startDate);
  switch (rule.freq) {
    case "DAILY":
      generateDailyValues(rule, currentDate, values, from, to);
      break;
    case "WEEKLY":
      generateWeeklyValues(rule, currentDate, values, from, to);
      break;
    case "MONTHLY":
      generateMonthlyValues(rule, currentDate, values, from, to);
      break;
    case "YEARLY":
      generateYearlyValues(rule, currentDate, values, from, to);
      break;
    default:
      throw new Error("Invalid recurring rule frequency");
  }
  return values;
}
__name(generateRecurringValues, "generateRecurringValues");
function generateDailyValues(rule, currentDate, values, from, to) {
  const { count, endDate, interval } = rule;
  const { bySetPos } = rule;
  let i = 0;
  while (true) {
    if (bySetPos == null || bySetPos.includes(getSetPos(currentDate))) {
      const res = currentDate.getTime();
      if (currentDate.getTime() > to) break;
      if (endDate != null && currentDate.getTime() > endDate) break;
      if (res >= from && res <= to) {
        values.push(res);
      }
      i++;
    }
    currentDate.setDate(currentDate.getDate() + (interval ?? 1));
    if (count !== void 0 && i === count) break;
  }
}
__name(generateDailyValues, "generateDailyValues");
function generateWeeklyValues(rule, currentDate, values, from, to) {
  const { count, endDate, interval } = rule;
  let { byDay, bySetPos } = rule;
  let i = 0;
  if (byDay === void 0) {
    byDay = [getWeekday(currentDate)];
  }
  while (true) {
    const next = new Date(currentDate).setDate(currentDate.getDate() + (interval ?? 1) * 7);
    const end = new Date(new Date(currentDate).setDate(currentDate.getDate() + 7));
    let date = currentDate;
    while (date < end) {
      if (endDate != null && date.getTime() > endDate) return;
      if (date.getTime() > to) return;
      if ((byDay == null || matchesByDay(date, byDay)) && (bySetPos == null || bySetPos.includes(getSetPos(date)))) {
        const res = date.getTime();
        if (res >= from && res <= to) {
          values.push(res);
        }
        i++;
      }
      date = new Date(date.setDate(date.getDate() + 1));
      if (count !== void 0 && i === count) return;
    }
    currentDate = new Date(next);
  }
}
__name(generateWeeklyValues, "generateWeeklyValues");
function matchesByDay(date, byDay) {
  const weekday = getWeekday(date);
  const dayOfMonth = Math.floor((date.getDate() - 1) / 7) + 1;
  for (const byDayItem of byDay) {
    if (byDayItem === weekday) {
      return true;
    }
    const pos = parseInt(byDayItem);
    if (isNaN(pos)) continue;
    if (pos > 0 && dayOfMonth === pos) {
      return true;
    }
    if (pos < 0 && dayOfMonth === getNegativePosition(date, weekday, pos)) {
      return true;
    }
  }
  return false;
}
__name(matchesByDay, "matchesByDay");
function getNegativePosition(date, weekday, pos) {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const occurrences = [];
  for (let day = lastDayOfMonth; day >= 1; day--) {
    const tempDate = new Date(date.getFullYear(), date.getMonth(), day);
    if (getWeekday(tempDate) === weekday) {
      occurrences.push(day);
    }
    if (occurrences.length === Math.abs(pos)) {
      return occurrences.pop();
    }
  }
  throw new Error(`Unable to calculate negative position ${pos}`);
}
__name(getNegativePosition, "getNegativePosition");
function generateMonthlyValues(rule, currentDate, values, from, to) {
  const { count, endDate, interval } = rule;
  let { byDay, byMonthDay, bySetPos } = rule;
  let i = 0;
  if (byDay == null && byMonthDay == null) {
    byMonthDay = [currentDate.getDate()];
  }
  while (true) {
    const next = new Date(currentDate).setMonth(currentDate.getMonth() + (interval ?? 1));
    const end = new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1));
    let date = currentDate;
    while (date < end) {
      if (endDate != null && date.getTime() > endDate) return;
      if (date.getTime() >= to) return;
      if ((byDay == null || matchesByDay(date, byDay)) && (byMonthDay == null || byMonthDay.includes(new Date(currentDate).getDate())) && (bySetPos == null || bySetPos.includes(getSetPos(currentDate)))) {
        const res = currentDate.getTime();
        if (res >= from && res <= to) {
          values.push(res);
        }
        i++;
      }
      date = new Date(date.setDate(date.getDate() + 1));
      if (count !== void 0 && i === count) return;
    }
    currentDate = new Date(next);
  }
}
__name(generateMonthlyValues, "generateMonthlyValues");
function generateYearlyValues(rule, currentDate, values, from, to) {
  const { count, endDate, interval } = rule;
  const { byDay, byMonthDay, byYearDay, byWeekNo, byMonth, bySetPos } = rule;
  let i = 0;
  while (true) {
    const next = new Date(currentDate).setFullYear(currentDate.getFullYear() + (interval ?? 1));
    const end = new Date(new Date(currentDate).setFullYear(currentDate.getFullYear() + 1));
    let date = currentDate;
    while (date < end) {
      if (endDate != null && date.getTime() > endDate) return;
      if (date.getTime() > to) return;
      if (byDay == null && byMonthDay == null && byYearDay == null && byWeekNo == null && byMonth == null && bySetPos == null) {
        date = new Date(next);
        const res = currentDate.getTime();
        if (res >= from && res <= to) {
          values.push(res);
        }
        i++;
      } else {
        if ((byDay == null || matchesByDay(date, byDay)) && (byMonthDay == null || byMonthDay.includes(currentDate.getDate())) && (byYearDay == null || byYearDay.includes(getYearDay(currentDate))) && (byWeekNo == null || byWeekNo.includes(getWeekNumber(currentDate))) && (byMonth == null || byMonth.includes(currentDate.getMonth())) && (bySetPos == null || bySetPos.includes(getSetPos(currentDate)))) {
          const res = currentDate.getTime();
          if (res >= from && res <= to) {
            values.push(res);
          }
          i++;
        }
        date = new Date(date.setDate(date.getDate() + 1));
      }
      if (count !== void 0 && i === count) return;
    }
    currentDate = new Date(next);
  }
}
__name(generateYearlyValues, "generateYearlyValues");
function getSetPos(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstOfMonth = new Date(year, month, 1);
  const daysOffset = firstOfMonth.getDay();
  const day = date.getDate();
  return Math.ceil((day + daysOffset) / 7);
}
__name(getSetPos, "getSetPos");
function getWeekday(date) {
  const weekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const weekday = weekdays[date.getDay()];
  return weekday;
}
__name(getWeekday, "getWeekday");
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysOffset = firstDayOfYear.getDay();
  const diff = (date.getTime() - firstDayOfYear.getTime()) / 864e5;
  return Math.floor((diff + daysOffset + 1) / 7);
}
__name(getWeekNumber, "getWeekNumber");
function getYearDay(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / 864e5);
}
__name(getYearDay, "getYearDay");
function getReccuringEventInstances(event, instances, from, to) {
  let res = [];
  for (const rule of event.rules ?? []) {
    const values = generateRecurringValues(rule, event.date, from, to);
    for (const val of values) {
      const instance = getInstance(event, val);
      res.push(instance);
    }
  }
  for (const date of event.rdate ?? []) {
    if (date < from || date > to) continue;
    const instance = getInstance(event, date);
    const exists = res.find((p) => p.date === instance.date);
    if (exists === void 0) res.push(instance);
  }
  const excludes = new Set(event.exdate ?? []);
  res = res.filter((p) => !excludes.has(p.date));
  res = res.filter((i) => {
    const override = instances.find((p) => p.originalStartTime === i.originalStartTime);
    return override === void 0;
  });
  return res;
}
__name(getReccuringEventInstances, "getReccuringEventInstances");
function getAllEvents(events, from, to) {
  const base = [];
  const recur = [];
  const instances = [];
  const recurData = [];
  const instancesMap = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event._class === import__.default.class.ReccuringEvent) {
      recur.push(event);
    } else if (event._class === import__.default.class.ReccuringInstance) {
      const instance = event;
      instances.push(instance);
      const arr = instancesMap.get(instance.recurringEventId) ?? [];
      arr.push(instance);
      instancesMap.set(instance.recurringEventId, arr);
    } else {
      if (from >= event.dueDate) continue;
      if (event.date >= to) continue;
      base.push(event);
    }
  }
  for (const rec of recur) {
    const recEvents = getReccuringEventInstances(rec, instancesMap.get(rec.eventId) ?? [], from, to);
    recurData.push(...recEvents);
  }
  const res = [
    ...base,
    ...recurData,
    ...instances.filter((p) => {
      return from <= p.dueDate && p.date <= to && p.isCancelled !== true;
    })
  ].map((it) => ({ ...it, date: Math.max(from, it.date), dueDate: Math.min(to, it.dueDate) }));
  res.sort((a, b) => a.date - b.date);
  return res;
}
__name(getAllEvents, "getAllEvents");
function generateEventId() {
  const id = (0, import_core.generateId)();
  return encodeToBase32Hex(id);
}
__name(generateEventId, "generateEventId");
function encodeToBase32Hex(input) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const base32HexDigits = "0123456789abcdefghijklmnopqrstuv";
  let result = "";
  for (let i = 0; i < bytes.length; i += 5) {
    const octets = [
      (bytes[i] ?? 0) >> 3,
      (bytes[i] & 7) << 2 | bytes[i + 1] >> 6,
      bytes[i + 1] >> 1 & 31,
      (bytes[i + 1] & 1) << 4 | bytes[i + 2] >> 4,
      (bytes[i + 2] & 15) << 1 | bytes[i + 3] >> 7,
      bytes[i + 3] >> 2 & 31,
      (bytes[i + 3] & 3) << 3 | bytes[i + 4] >> 5,
      bytes[i + 4] & 31
    ];
    for (let j = 0; j < 8; j++) {
      result += base32HexDigits.charAt(octets[j]);
    }
  }
  return result;
}
__name(encodeToBase32Hex, "encodeToBase32Hex");
//# sourceMappingURL=utils.js.map
