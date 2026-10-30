import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
async function start() {
  const httpDemo =
    new URLSearchParams(location.search).get('api') === 'http' &&
    ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!httpDemo) {
    if (!('serviceWorker' in navigator))
      throw new Error('This demo needs Service Worker support. Use the local HTTP demo instead.');
    await navigator.serviceWorker.register(new URL('mock-api-worker.js', document.baseURI), {
      type: 'module',
      scope: new URL('.', document.baseURI).pathname,
    });
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error('Demo API activation timed out. Reload this page.')),
          15000,
        );
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
      });
  }
  await bootstrapApplication(AppComponent, appConfig);
}
start().catch((error) => {
  console.error('AI-ToDu startup failed', error);
  const root = document.querySelector('app-root');
  if (root) {
    root.textContent =
      'The demo could not start. Enable site storage and reload, or run npm run demo locally.';
    root.setAttribute('role', 'alert');
  }
});
