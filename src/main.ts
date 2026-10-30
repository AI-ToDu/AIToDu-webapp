import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
async function start() {
  const query = new URLSearchParams(location.search);
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (local && query.get('api') === 'http') sessionStorage.setItem('ai-todu-transport', 'http');
  if (query.get('lang') === 'en_US' || query.get('lang') === 'es_419')
    localStorage.setItem('ai-todu-language', query.get('lang')!);
  if (query.get('role') === 'warehouse') sessionStorage.setItem('ai-todu-demo-role', 'warehouse');
  const httpDemo = local && sessionStorage.getItem('ai-todu-transport') === 'http';
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
    const spanish =
      document.documentElement.lang.startsWith('es') ||
      new URLSearchParams(location.search).get('lang') === 'es_419';
    root.textContent = spanish
      ? 'La demo no pudo iniciarse. Permite el almacenamiento de este sitio y vuelve a cargar.'
      : 'The demo could not start. Allow storage for this site and reload.';
    root.setAttribute('role', 'alert');
  }
});
