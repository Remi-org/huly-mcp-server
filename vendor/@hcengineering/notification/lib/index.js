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
  DOMAIN_DOC_NOTIFY: () => DOMAIN_DOC_NOTIFY,
  DOMAIN_NOTIFICATION: () => DOMAIN_NOTIFICATION,
  DOMAIN_USER_NOTIFY: () => DOMAIN_USER_NOTIFY,
  default: () => index_default,
  notificationId: () => notificationId
});
module.exports = __toCommonJS(index_exports);
var import_platform = require("@hcengineering/platform");
__reExport(index_exports, require("./types"), module.exports);
const DOMAIN_NOTIFICATION = "notification";
const DOMAIN_DOC_NOTIFY = "notification-dnc";
const DOMAIN_USER_NOTIFY = "notification-user";
const notificationId = "notification";
const notification = (0, import_platform.plugin)(notificationId, {
  mixin: {
    ClassCollaborators: "",
    Collaborators: "",
    NotificationObjectPresenter: "",
    NotificationPreview: "",
    NotificationContextPresenter: ""
  },
  class: {
    BrowserNotification: "",
    PushSubscription: "",
    BaseNotificationType: "",
    NotificationType: "",
    CommonNotificationType: "",
    NotificationGroup: "",
    NotificationPreferencesGroup: "",
    DocNotifyContext: "",
    InboxNotification: "",
    ActivityInboxNotification: "",
    CommonInboxNotification: "",
    ActivityNotificationViewlet: "",
    MentionInboxNotification: "",
    NotificationProvider: "",
    NotificationTypeSetting: "",
    NotificationProviderSetting: "",
    NotificationProviderDefaults: ""
  },
  ids: {
    NotificationSettings: "",
    NotificationGroup: "",
    CollaboratoAddNotification: "",
    MentionCommonNotificationType: ""
  },
  metadata: {
    PushPublicKey: ""
  },
  providers: {
    InboxNotificationProvider: "",
    PushNotificationProvider: "",
    SoundNotificationProvider: ""
  },
  integrationType: {
    MobileApp: ""
  },
  component: {
    Inbox: "",
    NotificationPresenter: "",
    CollaboratorsChanged: "",
    DocNotifyContextPresenter: "",
    NotificationCollaboratorsChanged: "",
    ReactionNotificationPresenter: "",
    GeneralPreferencesGroup: ""
  },
  action: {
    PinDocNotifyContext: "",
    UnpinDocNotifyContext: "",
    UnReadNotifyContext: "",
    ReadNotifyContext: "",
    ArchiveContextNotifications: "",
    UnarchiveContextNotifications: ""
  },
  icon: {
    Notifications: "",
    Inbox: "",
    BellCrossed: ""
  },
  string: {
    Notification: "",
    Notifications: "",
    DontTrack: "",
    Inbox: "",
    CommonNotificationTitle: "",
    CommonNotificationBody: "",
    CommonNotificationChanged: "",
    CommonNotificationChangedProperty: "",
    ChangedCollaborators: "",
    NewCollaborators: "",
    RemovedCollaborators: "",
    Edited: "",
    Pinned: "",
    All: "",
    ArchiveAll: "",
    MarkReadAll: "",
    MarkUnreadAll: "",
    ArchiveAllConfirmationTitle: "",
    ArchiveAllConfirmationMessage: "",
    YouAddedCollaborators: "",
    YouRemovedCollaborators: "",
    Push: "",
    General: "",
    InboxNotificationsDescription: "",
    PushNotificationsDescription: "",
    CommonNotificationCollectionAdded: "",
    CommonNotificationCollectionRemoved: "",
    SoundNotificationsDescription: "",
    Sound: "",
    NoAccessToObject: "",
    ViewIn: ""
  },
  function: {
    Notify: "",
    CheckPushPermission: "",
    GetInboxNotificationsClient: "",
    HasInboxNotifications: "",
    IsNotificationAllowed: ""
  },
  resolver: {
    Location: ""
  }
});
var index_default = notification;
//# sourceMappingURL=index.js.map
