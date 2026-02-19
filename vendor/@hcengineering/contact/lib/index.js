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
  AvatarType: () => AvatarType,
  contactId: () => contactId,
  contactPlugin: () => contactPlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./types"), module.exports);
__reExport(index_exports, require("./utils"), module.exports);
__reExport(index_exports, require("./analytics"), module.exports);
var AvatarType = /* @__PURE__ */ ((AvatarType2) => {
  AvatarType2["COLOR"] = "color";
  AvatarType2["IMAGE"] = "image";
  AvatarType2["GRAVATAR"] = "gravatar";
  AvatarType2["EXTERNAL"] = "external";
  return AvatarType2;
})(AvatarType || {});
const contactId = "contact";
const contactPlugin = (0, import_platform.plugin)(contactId, {
  class: {
    AvatarProvider: "",
    ChannelProvider: "",
    Channel: "",
    Contact: "",
    Person: "",
    Member: "",
    Organization: "",
    PersonAccount: "",
    Status: "",
    ContactsTab: "",
    PersonSpace: ""
  },
  mixin: {
    Employee: ""
  },
  component: {
    SocialEditor: "",
    CreateOrganization: "",
    CreatePerson: "",
    ChannelsPresenter: "",
    MembersPresenter: "",
    Avatar: "",
    AvatarRef: "",
    UserBoxList: "",
    ChannelPresenter: "",
    SpaceMembers: "",
    DeleteConfirmationPopup: "",
    AccountArrayEditor: "",
    PersonIcon: "",
    EditOrganizationPanel: "",
    CollaborationUserAvatar: "",
    CreateGuest: "",
    SpaceMembersEditor: "",
    ContactNamePresenter: ""
  },
  channelProvider: {
    Email: "",
    Phone: "",
    LinkedIn: "",
    Twitter: "",
    Telegram: "",
    GitHub: "",
    Facebook: "",
    Homepage: "",
    Whatsapp: "",
    Skype: "",
    Profile: "",
    Viber: ""
  },
  avatarProvider: {
    Color: "",
    Image: "",
    Gravatar: ""
  },
  function: {
    GetColorUrl: "",
    GetFileUrl: "",
    GetGravatarUrl: "",
    GetExternalUrl: ""
  },
  icon: {
    ContactApplication: "",
    Phone: "",
    Email: "",
    Discord: "",
    Facebook: "",
    Instagram: "",
    LinkedIn: "",
    Telegram: "",
    Twitter: "",
    VK: "",
    WhatsApp: "",
    Skype: "",
    Youtube: "",
    GitHub: "",
    Edit: "",
    Person: "",
    Persona: "",
    Company: "",
    SocialEdit: "",
    Homepage: "",
    Whatsapp: "",
    ComponentMembers: "",
    Profile: "",
    KickUser: "",
    Contacts: "",
    Viber: ""
  },
  space: {
    Contacts: ""
  },
  app: {
    Contacts: ""
  },
  metadata: {
    LastNameFirst: ""
  },
  string: {
    PersonAlreadyExists: "",
    Person: "",
    Employee: "",
    CreateOrganization: "",
    UseImage: "",
    UseGravatar: "",
    UseColor: "",
    PersonFirstNamePlaceholder: "",
    PersonLastNamePlaceholder: "",
    NumberMembers: "",
    Position: "",
    For: "",
    SelectUsers: "",
    AddGuest: "",
    Members: "",
    Contacts: "",
    Employees: "",
    Persons: "",
    ViewProfile: ""
  },
  viewlet: {
    TableMember: "",
    TablePerson: "",
    TableEmployee: "",
    TableOrganization: ""
  },
  filter: {
    FilterChannelIn: "",
    FilterChannelNin: "",
    FilterChannelHasMessages: "",
    FilterChannelHasNewMessages: ""
  },
  resolver: {
    Location: ""
  },
  templateFieldCategory: {
    CurrentEmployee: "",
    Contact: ""
  },
  templateField: {
    CurrentEmployeeName: "",
    CurrentEmployeePosition: "",
    CurrentEmployeeEmail: "",
    ContactName: "",
    ContactFirstName: "",
    ContactLastName: ""
  },
  ids: {
    MentionCommonNotificationType: ""
  },
  extension: {
    EmployeePopupActions: ""
  }
});
var index_default = contactPlugin;
//# sourceMappingURL=index.js.map
