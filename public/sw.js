// Minimaler Service Worker, nur um die App installierbar zu machen.
// Später können wir Caching/Offline-Funktion ergänzen.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
