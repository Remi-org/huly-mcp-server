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
  viewId: () => viewId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./types"), module.exports);
__reExport(index_exports, require("./utils"), module.exports);
const viewId = "view";
const view = (0, import_platform.plugin)(viewId, {
  mixin: {
    ClassFilters: "",
    AttributeFilter: "",
    AttributeEditor: "",
    CollectionPresenter: "",
    CollectionEditor: "",
    InlineAttributEditor: "",
    ArrayEditor: "",
    AttributePresenter: "",
    ActivityAttributePresenter: "",
    ListItemPresenter: "",
    ObjectEditor: "",
    ObjectPresenter: "",
    ObjectEditorHeader: "",
    ObjectEditorFooter: "",
    ObjectPanelFooter: "",
    ObjectValidator: "",
    ObjectFactory: "",
    ObjectTitle: "",
    ObjectIdentifier: "",
    ReferenceObjectProvider: "",
    ObjectTooltip: "",
    SpaceHeader: "",
    SpaceName: "",
    IgnoreActions: "",
    PreviewPresenter: "",
    ListHeaderExtra: "",
    SortFuncs: "",
    AllValuesFunc: "",
    ObjectPanel: "",
    LinkProvider: "",
    LinkIdProvider: "",
    SpacePresenter: "",
    AttributeFilterPresenter: "",
    Aggregation: "",
    Groupping: "",
    ObjectIcon: ""
  },
  class: {
    ViewletPreference: "",
    ViewletDescriptor: "",
    Viewlet: "",
    Action: "",
    ActionCategory: "",
    LinkPresenter: "",
    FilterMode: "",
    FilteredView: "",
    AttrPresenter: ""
  },
  action: {
    Delete: "",
    Archive: "",
    UnArchive: "",
    Join: "",
    Leave: "",
    Move: "",
    MoveLeft: "",
    MoveRight: "",
    MoveUp: "",
    MoveDown: "",
    SelectItem: "",
    SelectItemAll: "",
    SelectItemNone: "",
    SelectUp: "",
    SelectDown: "",
    ShowPreview: "",
    ShowActions: "",
    Preview: "",
    // Edit document
    Open: "",
    OpenInNewTab: "",
    RemoveRelation: ""
  },
  viewlet: {
    Table: "",
    List: ""
  },
  component: {
    ActionsPopup: "",
    ObjectPresenter: "",
    EditDoc: "",
    SpacePresenter: "",
    BooleanTruePresenter: "",
    ValueSelector: "",
    GrowPresenter: "",
    DividerPresenter: "",
    IconWithEmoji: "",
    AttachedDocPanel: "",
    ObjectMention: "",
    SearchSelector: "",
    FoldersBrowser: ""
  },
  ids: {
    IconWithEmoji: ""
  },
  string: {
    CustomizeView: "",
    LabelNA: "",
    View: "",
    FilteredViews: "",
    NewFilteredView: "",
    FilteredViewName: "",
    Move: "",
    MoveClass: "",
    SelectToMove: "",
    Cancel: "",
    List: "",
    Grid: "",
    AddSavedView: "",
    Timeline: "",
    Public: "",
    Hide: "",
    Rename: "",
    Assigned: "",
    Open: "",
    OpenInNewTab: "",
    Created: "",
    Delete: "",
    Then: "",
    Or: "",
    Subscribed: "",
    HyperlinkPlaceholder: "",
    CopyToClipboard: "",
    NoGrouping: "",
    Type: "",
    UnArchive: "",
    Archive: "",
    Save: "",
    PublicView: "",
    Archived: "",
    MoreActions: "",
    Pin: "",
    Unpin: "",
    Join: "",
    Leave: "",
    Copied: "",
    And: "",
    Title: "",
    DeleteObject: "",
    DeleteObjectConfirm: "",
    RemoveRelationConfirmation: "",
    RemoveRelation: ""
  },
  icon: {
    Table: "",
    List: "",
    Card: "",
    Timeline: "",
    Delete: "",
    MoreH: "",
    Move: "",
    Archive: "",
    Statuses: "",
    Setting: "",
    Open: "",
    Edit: "",
    CopyId: "",
    CopyLink: "",
    ArrowRight: "",
    Views: "",
    Pin: "",
    Model: "",
    DevModel: "",
    ViewButton: "",
    Filter: "",
    Configure: "",
    Database: "",
    Star: "",
    Eye: "",
    EyeCrossed: "",
    Bubble: "",
    CheckCircle: "",
    Add: "",
    Image: "",
    Table2: "",
    CodeBlock: "",
    SeparatorLine: "",
    Circle: "",
    Join: "",
    Leave: "",
    Copy: "",
    TodoList: "",
    DetailsFilled: "",
    Translate: "",
    Undo: "",
    Video: "",
    Audio: "",
    File: "",
    PinTack: "",
    Feather: ""
  },
  category: {
    General: "",
    GeneralNavigation: "",
    Navigation: "",
    Editor: "",
    MarkdownFormatting: ""
  },
  filter: {
    FilterArrayAll: "",
    FilterArrayAny: "",
    FilterObjectIn: "",
    FilterObjectNin: "",
    FilterValueIn: "",
    FilterValueNin: "",
    FilterBefore: "",
    FilterAfter: "",
    FilterContains: "",
    FilterNestedMatch: "",
    FilterNestedDontMatch: "",
    FilterDateOutdated: "",
    FilterDateToday: "",
    FilterDateYesterday: "",
    FilterDateWeek: "",
    FilterDateNextW: "",
    FilterDateM: "",
    FilterDateNextM: "",
    FilterDateNotSpecified: "",
    FilterDateCustom: "",
    FilterDateBetween: ""
  },
  popup: {
    PositionElementAlignment: ""
  },
  actionImpl: {
    CopyTextToClipboard: "",
    UpdateDocument: "",
    ShowPanel: "",
    ShowPopup: "",
    ShowEditor: "",
    ValueSelector: "",
    AttributeSelector: "",
    Delete: ""
  }
});
var index_default = view;
//# sourceMappingURL=index.js.map
