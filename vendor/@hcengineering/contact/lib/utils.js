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
var utils_exports = {};
__export(utils_exports, {
  checkHasGravatar: () => checkHasGravatar,
  combineName: () => combineName,
  findContacts: () => findContacts,
  findPerson: () => findPerson,
  formatContactName: () => formatContactName,
  formatName: () => formatName,
  getAvatarColorForId: () => getAvatarColorForId,
  getAvatarColorName: () => getAvatarColorName,
  getAvatarColors: () => getAvatarColors,
  getAvatarProviderId: () => getAvatarProviderId,
  getFirstName: () => getFirstName,
  getGravatarUrl: () => getGravatarUrl,
  getLastName: () => getLastName,
  getName: () => getName
});
module.exports = __toCommonJS(utils_exports);
var import_platform = require("@hcengineering/platform");
var import__ = require(".");
var import_types = require("./types");
function getAvatarColorForId(id) {
  if (id == null) return import_types.AVATAR_COLORS[0].color;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }
  return import_types.AVATAR_COLORS[hash % import_types.AVATAR_COLORS.length].color;
}
__name(getAvatarColorForId, "getAvatarColorForId");
function getAvatarColors() {
  return import_types.AVATAR_COLORS;
}
__name(getAvatarColors, "getAvatarColors");
function getAvatarColorName(color) {
  return import_types.AVATAR_COLORS.find((col) => col.color === color)?.name ?? import_types.AVATAR_COLORS[0].name;
}
__name(getAvatarColorName, "getAvatarColorName");
function getAvatarProviderId(kind) {
  switch (kind) {
    case import__.AvatarType.GRAVATAR:
      return import__.contactPlugin.avatarProvider.Gravatar;
    case import__.AvatarType.COLOR:
      return import__.contactPlugin.avatarProvider.Color;
  }
  return import__.contactPlugin.avatarProvider.Image;
}
__name(getAvatarProviderId, "getAvatarProviderId");
function getGravatarUrl(gravatarId, width = 64, placeholder = "identicon") {
  return `https://gravatar.com/avatar/${gravatarId}?s=${width}&d=${placeholder}`;
}
__name(getGravatarUrl, "getGravatarUrl");
async function checkHasGravatar(gravatarId, fetch) {
  try {
    return (await (fetch ?? window.fetch)(getGravatarUrl(gravatarId, 2048, "404"))).ok;
  } catch {
    return false;
  }
}
__name(checkHasGravatar, "checkHasGravatar");
async function findContacts(client, _class, name, channels) {
  if (channels.length === 0 && name.length === 0) {
    return { contacts: [], channels: [] };
  }
  const values = channels.map((it) => it.value.trim()).filter((it) => it.length > 0);
  const potentialChannels = values.length === 0 ? [] : await client.findAll(import__.contactPlugin.class.Channel, { value: { $in: values } }, { limit: 1e3 });
  const channelsMap = /* @__PURE__ */ new Map();
  for (const ch of potentialChannels) {
    const arr = channelsMap.get(ch.attachedTo) ?? [];
    channelsMap.set(ch.attachedTo, [...arr, ch]);
  }
  const potentialContactIds = Array.from(channelsMap.keys());
  let potentialPersons = [];
  if (potentialContactIds.length === 0) {
    if (client.getHierarchy().isDerived(_class, import__.contactPlugin.class.Person)) {
      const firstName = getFirstName(name).split(" ").shift() ?? "";
      const lastName = getLastName(name);
      potentialPersons = await client.findAll(
        import__.contactPlugin.class.Contact,
        { name: { $like: `${lastName}%${firstName}%` } },
        { limit: 100 }
      );
    } else if (client.getHierarchy().isDerived(_class, import__.contactPlugin.class.Organization)) {
      potentialPersons = await client.findAll(
        import__.contactPlugin.class.Contact,
        { name: { $like: `${name}` } },
        { limit: 100 }
      );
    }
  } else {
    potentialPersons = await client.findAll(import__.contactPlugin.class.Contact, { _id: { $in: potentialContactIds } });
  }
  const result = [];
  const resChannels = [];
  for (const c of potentialPersons) {
    let matches = 0;
    if (c.name.trim().toLowerCase() === name.trim().toLowerCase()) {
      matches++;
    }
    const contactChannels = channelsMap.get(c._id) ?? [];
    for (const ch of contactChannels) {
      for (const chc of channels) {
        if (chc.provider === ch.provider && chc.value.trim().toLowerCase() === ch.value.trim().toLowerCase()) {
          resChannels.push(chc);
          matches++;
          break;
        }
      }
    }
    if (matches > 0) {
      result.push(c);
    }
  }
  return { contacts: result, channels: resChannels };
}
__name(findContacts, "findContacts");
async function findPerson(client, name, channels) {
  const result = await findContacts(client, import__.contactPlugin.class.Person, name, channels);
  return result.contacts;
}
__name(findPerson, "findPerson");
const SEP = ",";
function combineName(first, last) {
  return last + SEP + first;
}
__name(combineName, "combineName");
function getFirstName(name) {
  return name !== void 0 ? name.substring(name.indexOf(SEP) + 1) : "";
}
__name(getFirstName, "getFirstName");
function getLastName(name) {
  return name !== void 0 ? name.substring(0, name.indexOf(SEP)) : "";
}
__name(getLastName, "getLastName");
function formatName(name, lastNameFirst) {
  const lastNameFirstCombined = lastNameFirst !== void 0 ? lastNameFirst === "true" : (0, import_platform.getMetadata)(import__.contactPlugin.metadata.LastNameFirst) === true;
  return lastNameFirstCombined ? getLastName(name) + " " + getFirstName(name) : getFirstName(name) + " " + getLastName(name);
}
__name(formatName, "formatName");
function getName(hierarchy, value, lastNameFirst) {
  if (isPerson(hierarchy, value)) {
    return formatName(value.name, lastNameFirst);
  }
  return value.name;
}
__name(getName, "getName");
function isPerson(hierarchy, value) {
  return isPersonClass(hierarchy, value._class);
}
__name(isPerson, "isPerson");
function isPersonClass(hierarchy, _class) {
  return hierarchy.isDerived(_class, import__.contactPlugin.class.Person);
}
__name(isPersonClass, "isPersonClass");
function formatContactName(hierarchy, _class, name, lastNameFirst) {
  if (isPersonClass(hierarchy, _class)) {
    return formatName(name, lastNameFirst);
  }
  return name;
}
__name(formatContactName, "formatContactName");
//# sourceMappingURL=utils.js.map
