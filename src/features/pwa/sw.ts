/* eslint-disable no-restricted-globals */
const CACHE = 'svm-cache-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event: any) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll([OFFLINE_URL])
  })())
})

self.addEventListener('fetch', (event: any) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse
        if (preload) return preload
        return await fetch(event.request)
      } catch {
        const cache = await caches.open(CACHE)
        return await cache.match(OFFLINE_URL)
      }
    })())
  }
})
