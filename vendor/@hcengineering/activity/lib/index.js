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
var index_exports = {};
__export(index_exports, {
  activityId: () => activityId,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
const activityId = "activity";
var index_default = (0, import_platform.plugin)(activityId, {
  mixin: {
    ActivityDoc: "",
    ActivityAttributeUpdatesPresenter: "",
    ActivityMessagePreview: "",
    IgnoreActivity: ""
  },
  class: {
    DocUpdateMessage: "",
    ActivityMessage: "",
    ActivityInfoMessage: "",
    ActivityMessageControl: "",
    DocUpdateMessageViewlet: "",
    ActivityMessagesFilter: "",
    ActivityExtension: "",
    Reaction: "",
    SavedMessage: "",
    ActivityReference: "",
    ReplyProvider: "",
    UserMentionInfo: ""
  },
  icon: {
    Activity: "",
    Emoji: "",
    Bookmark: "",
    BookmarkFilled: ""
  },
  string: {
    Activity: "",
    Added: "",
    Changed: "",
    Edited: "",
    From: "",
    Removed: "",
    To: "",
    Unset: "",
    In: "",
    At: "",
    NewestFirst: "",
    Edit: "",
    Updated: "",
    Created: "",
    UpdatedCollection: "",
    New: "",
    Set: "",
    Update: "",
    For: "",
    AllActivity: "",
    Reaction: "",
    Reactions: "",
    LastReply: "",
    RepliesCount: "",
    Reacted: "",
    Message: "",
    Mentioned: "",
    You: "",
    Mentions: "",
    MentionedYouIn: "",
    Messages: "",
    Thread: "",
    ReactionNotificationTitle: "",
    ReactionNotificationBody: "",
    NewObject: "",
    RemovedObject: "",
    ChangedObject: "",
    UnsetObject: "",
    UpdatedObject: ""
  },
  component: {
    Activity: "",
    ActivityMessagePresenter: "",
    DocUpdateMessagePresenter: "",
    ActivityInfoMessagePresenter: "",
    ReactionPresenter: "",
    ActivityMessageNotificationLabel: "",
    ActivityReferencePresenter: "",
    DocUpdateMessagePreview: "",
    ActivityReferencePreview: "",
    ActivityInfoMessagePreview: ""
  },
  ids: {
    AllFilter: "",
    MentionNotification: ""
  },
  extension: {
    ActivityEmployeePresenter: ""
  },
  function: {
    ShouldScrollToActivity: ""
  },
  backreference: {
    // Update list of back references
    Update: ""
  },
  action: {
    Reply: ""
  }
});
//# sourceMappingURL=index.js.map
