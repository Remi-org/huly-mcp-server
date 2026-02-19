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
var component_exports = {};
__export(component_exports, {
  coreId: () => coreId,
  default: () => component_default,
  systemAccountEmail: () => systemAccountEmail
});
module.exports = __toCommonJS(component_exports);
var import_platform = require("@hcengineering/platform");
const coreId = "core";
const systemAccountEmail = "anticrm@hc.engineering";
var component_default = (0, import_platform.plugin)(coreId, {
  class: {
    Obj: "",
    Doc: "",
    Blob: "",
    AttachedDoc: "",
    Class: "",
    Mixin: "",
    Interface: "",
    Attribute: "",
    Tx: "",
    TxModelUpgrade: "",
    TxWorkspaceEvent: "",
    TxApplyIf: "",
    TxCUD: "",
    TxCreateDoc: "",
    TxMixin: "",
    TxUpdateDoc: "",
    TxRemoveDoc: "",
    Space: "",
    SystemSpace: "",
    TypedSpace: "",
    SpaceTypeDescriptor: "",
    SpaceType: "",
    Role: "",
    Permission: "",
    Account: "",
    Type: "",
    TypeRelation: "",
    TypeString: "",
    TypeBlob: "",
    TypeIntlString: "",
    TypeHyperlink: "",
    TypeNumber: "",
    TypeFileSize: "",
    TypeMarkup: "",
    TypeRank: "",
    TypeRecord: "",
    TypeBoolean: "",
    TypeTimestamp: "",
    TypeDate: "",
    TypeCollaborativeDoc: "",
    RefTo: "",
    ArrOf: "",
    Enum: "",
    EnumOf: "",
    Collection: "",
    TypeAny: "",
    Version: "",
    PluginConfiguration: "",
    UserStatus: "",
    TypeRelatedDocument: "",
    DocIndexState: "",
    DomainIndexConfiguration: "",
    Configuration: "",
    Status: "",
    StatusCategory: "",
    MigrationState: "",
    BenchmarkDoc: "",
    FullTextSearchContext: "",
    Association: "",
    Relation: "",
    Sequence: ""
  },
  icon: {
    TypeString: "",
    TypeBlob: "",
    TypeHyperlink: "",
    TypeNumber: "",
    TypeMarkup: "",
    TypeRank: "",
    TypeRecord: "",
    TypeBoolean: "",
    TypeDate: "",
    TypeRef: "",
    TypeArray: "",
    TypeEnumOf: "",
    TypeCollection: ""
  },
  mixin: {
    ConfigurationElement: "",
    IndexConfiguration: "",
    SpacesTypeData: "",
    TransientConfiguration: ""
  },
  space: {
    Tx: "",
    DerivedTx: "",
    Model: "",
    Space: "",
    Configuration: "",
    Workspace: ""
  },
  account: {
    System: "",
    ConfigUser: ""
  },
  status: {
    ObjectNotFound: "",
    ItemNotFound: ""
  },
  version: {
    Model: ""
  },
  string: {
    Id: "",
    Space: "",
    Spaces: "",
    SpacesDescription: "",
    TypedSpace: "",
    SpaceType: "",
    Modified: "",
    ModifiedDate: "",
    ModifiedBy: "",
    Class: "",
    AttachedTo: "",
    AttachedToClass: "",
    String: "",
    Record: "",
    Markup: "",
    Relation: "",
    Relations: "",
    AddRelation: "",
    Collaborative: "",
    CollaborativeDoc: "",
    MarkupBlobRef: "",
    Number: "",
    Boolean: "",
    Timestamp: "",
    Date: "",
    IntlString: "",
    Ref: "",
    Collection: "",
    Array: "",
    Name: "",
    Enum: "",
    Size: "",
    Description: "",
    ShortDescription: "",
    Descriptor: "",
    TargetClass: "",
    Role: "",
    Roles: "",
    Hyperlink: "",
    Private: "",
    Object: "",
    System: "",
    CreatedBy: "",
    CreatedDate: "",
    Status: "",
    Account: "",
    StatusCategory: "",
    Rank: "",
    Members: "",
    Owners: "",
    Permission: "",
    CreateObject: "",
    UpdateObject: "",
    DeleteObject: "",
    ForbidDeleteObject: "",
    UpdateSpace: "",
    ArchiveSpace: "",
    CreateProject: "",
    CreateObjectDescription: "",
    UpdateObjectDescription: "",
    DeleteObjectDescription: "",
    ForbidDeleteObjectDescription: "",
    UpdateSpaceDescription: "",
    ArchiveSpaceDescription: "",
    CreateProjectDescription: "",
    AutoJoin: "",
    AutoJoinDescr: ""
  },
  descriptor: {
    SpacesType: ""
  },
  spaceType: {
    SpacesType: ""
  },
  permission: {
    CreateObject: "",
    UpdateObject: "",
    DeleteObject: "",
    ForbidDeleteObject: "",
    UpdateSpace: "",
    ArchiveSpace: "",
    CreateProject: ""
  },
  role: {
    Admin: ""
  },
  metadata: {
    DisablePermissions: ""
  }
});
//# sourceMappingURL=component.js.map
