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
  default: () => index_default,
  settingId: () => settingId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./spaceTypeEditor"), module.exports);
__reExport(index_exports, require("./utils"), module.exports);
__reExport(index_exports, require("./analytics"), module.exports);
const settingId = "setting";
var index_default = (0, import_platform.plugin)(settingId, {
  ids: {
    SettingApp: "",
    Profile: "",
    Password: "",
    Setting: "",
    Integrations: "",
    Relations: "",
    Support: "",
    Privacy: "",
    Terms: "",
    ClassSetting: "",
    General: "",
    Owners: "",
    InviteSettings: "",
    WorkspaceSetting: "",
    ManageSpaces: "",
    Spaces: "",
    Backup: "",
    Export: "",
    DisablePermissionsConfiguration: ""
  },
  mixin: {
    Editable: "",
    UserMixin: "",
    SpaceTypeEditor: "",
    SpaceTypeCreator: ""
  },
  class: {
    SettingsCategory: "",
    WorkspaceSettingCategory: "",
    Integration: "",
    IntegrationType: "",
    InviteSettings: "",
    WorkspaceSetting: ""
  },
  component: {
    Settings: "",
    Profile: "",
    Password: "",
    WorkspaceSettings: "",
    Integrations: "",
    Support: "",
    Privacy: "",
    Terms: "",
    ClassSetting: "",
    PermissionPresenter: "",
    SpaceTypeDescriptorPresenter: "",
    SpaceTypeGeneralSectionEditor: "",
    SpaceTypePropertiesSectionEditor: "",
    SpaceTypeRolesSectionEditor: "",
    RoleEditor: "",
    RoleAssignmentEditor: "",
    RelationSetting: "",
    Backup: "",
    CreateAttributePopup: "",
    CreateRelation: "",
    EditRelation: ""
  },
  string: {
    Settings: "",
    Setting: "",
    Spaces: "",
    WorkspaceSettings: "",
    Integrations: "",
    Support: "",
    Privacy: "",
    Terms: "",
    Categories: "",
    Delete: "",
    Disconnect: "",
    Add: "",
    AccountSettings: "",
    ChangePassword: "",
    CurrentPassword: "",
    NewPassword: "",
    Saving: "",
    Saved: "",
    EnterCurrentPassword: "",
    EnterNewPassword: "",
    RepeatNewPassword: "",
    Signout: "",
    InviteWorkspace: "",
    SelectWorkspace: "",
    Reconnect: "",
    ClassSetting: "",
    Classes: "",
    Owners: "",
    Configure: "",
    InviteSettings: "",
    General: "",
    Properties: "",
    TaskTypes: "",
    Automations: "",
    Collections: "",
    SpaceTypes: "",
    Roles: "",
    OwnerOrMaintainerRequired: "",
    Backup: "",
    BackupLast: "",
    BackupTotalSnapshots: "",
    BackupTotalFiles: "",
    BackupSize: "",
    BackupLinkInfo: "",
    BackupBearerTokenInfo: "",
    BackupSnapshots: "",
    BackupFileDownload: "",
    BackupFiles: "",
    BackupNoBackup: "",
    AddAttribute: ""
  },
  icon: {
    AccountSettings: "",
    Owners: "",
    Password: "",
    Setting: "",
    Integrations: "",
    Support: "",
    Privacy: "",
    Terms: "",
    Signout: "",
    SelectWorkspace: "",
    Clazz: "",
    Enums: "",
    InviteSettings: "",
    InviteWorkspace: "",
    Views: "",
    Relations: ""
  },
  templateFieldCategory: {
    Integration: ""
  },
  templateField: {
    OwnerFirstName: "",
    OwnerLastName: "",
    OwnerPosition: "",
    Value: ""
  },
  metadata: {
    BackupUrl: ""
  }
});
//# sourceMappingURL=index.js.map
