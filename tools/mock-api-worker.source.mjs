import { seed, handle, normalizeBody, DomainError } from '../public/mock/engine.mjs';
const DB_NAME = 'ai-todu-tb1-v1';
const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
async function respond(request, path) {
  try {
    const input = ['GET', 'HEAD'].includes(request.method)
      ? {}
      : await request.json().catch(() => ({}));
    const body = await normalizeBody(input, path);
    const initial = await seed();
    const db = await openDb();
    const result = await new Promise((resolve, reject) => {
      const transaction = db.transaction('workspace', 'readwrite');
      const store = transaction.objectStore('workspace');
      let response;
      const read = store.get('state');
      read.onsuccess = () => {
        try {
          response = handle(
            read.result ?? initial,
            request.method,
            path,
            body,
            (request.headers.get('Authorization') ?? '').replace(/^Bearer /, ''),
          );
          store.put(response.state, 'state');
        } catch (error) {
          transaction.abort();
          reject(error);
        }
      };
      transaction.oncomplete = () => resolve(response);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? new Error('Transaction aborted'));
    });
    db.close();
    return new Response(result.status === 204 ? null : JSON.stringify(result.body), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-AI-ToDu-Transport': 'service-worker-demo',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ code: e instanceof DomainError ? e.code : 'STORAGE_UNAVAILABLE' }),
      {
        status: e instanceof DomainError ? e.status : 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
self.addEventListener('fetch', (event) => {
  if (
    ['localhost', '127.0.0.1'].includes(self.location.hostname) &&
    event.request.headers.get('X-AI-ToDu-Transport') === 'http'
  )
    return;
  const url = new URL(event.request.url);
  const prefix = new URL('api/v1', self.registration.scope).pathname;
  if (
    url.origin === self.location.origin &&
    (url.pathname === prefix || url.pathname.startsWith(prefix + '/'))
  )
    event.respondWith(respond(event.request, url.pathname.slice(prefix.length) || '/'));
});
