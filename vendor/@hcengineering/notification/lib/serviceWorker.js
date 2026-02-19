"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
self.addEventListener("push", (event) => {
  const payload = event.data.json();
  self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    tag: payload.tag,
    data: {
      domain: payload.domain,
      url: payload.url,
      notificationId: payload.tag
    }
  });
});
async function handleNotificationClick(event) {
  event.notification.close();
  const clickedNotification = event.notification;
  const notificationData = clickedNotification.data;
  const notificationId = notificationData.notificationId;
  const notificationUrl = notificationData.url;
  const domain = notificationData.domain;
  if (notificationUrl !== void 0 && domain !== void 0) {
    const windowClients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });
    const targetUrl = new URL(notificationUrl);
    for (const client of windowClients) {
      const clientUrl = new URL(client.url, self.location.href);
      if (decodeURI(clientUrl.pathname) === targetUrl.pathname) {
        client.postMessage({
          type: "notification-click",
          url: notificationUrl,
          _id: notificationId
        });
        await client.focus();
        return;
      }
    }
    for (const client of windowClients) {
      if (client.url?.startsWith(domain)) {
        client.postMessage({
          type: "notification-click",
          url: notificationUrl,
          _id: notificationId
        });
        await client.focus();
        return;
      }
    }
    console.log("No matching client found");
    await self.clients.openWindow(notificationUrl);
  }
}
__name(handleNotificationClick, "handleNotificationClick");
self.addEventListener("notificationclick", (e) => e.waitUntil(handleNotificationClick(e)));
//# sourceMappingURL=serviceWorker.js.map
