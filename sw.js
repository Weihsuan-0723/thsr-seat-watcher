// 高鐵餘票監看器 — service worker
// 只負責兩件事：讓網頁可以「加入主畫面」，以及在手機上顯示系統通知。
// 不快取任何資料，確保每次看到的都是最新版本與最新座位。

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// 點通知時回到監看器分頁（沒開著就開一個）
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const tab = all.find((c) => c.url.startsWith(self.registration.scope));
    if (tab) return tab.focus();
    return self.clients.openWindow(self.registration.scope);
  })());
});
