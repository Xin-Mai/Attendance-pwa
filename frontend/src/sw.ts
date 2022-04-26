import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import {
  Route,
  registerRoute,
  NavigationRoute,
  setCatchHandler,
} from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

// 科里化
const curryRegisterRouter = (route: Route): { use: Function } => {
  registerRoute(route);
  const curry: { use: Function } = { use: curryRegisterRouter };
  return curry;
};

// Handle images:
// 默认缓存30天
const imageRoute = new Route(
  ({ request }) => {
    return request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// Handle scripts:
// Evict the least-used script cache entries when
// the cache has more than 50 entries:
const scriptsRoute = new Route(
  ({ url, request }) => {
    return (
      request.destination === 'script' &&
      /\/src\/.*\.(js|ts)/.test(url.pathname)
    );
  },
  new CacheFirst({
    cacheName: 'scripts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
      }),
    ],
  })
);

// Handle styles:
const stylesRoute = new Route(
  ({ request }) => {
    return request.destination === 'style';
  },
  new CacheFirst({
    cacheName: 'styles',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// const apiRoute = new Route(
//   ({ url }) => {
//     return /.*\/api\/.*/.test(url.pathname);
//   },
//   new NetworkOnly(),
//   'POST'
// );

// 用于捕获routing的错误
setCatchHandler(async ({ url, event, params }) => {
  console.log(url, event, params, 'failed');
  return new Response('some err occurred in the workbox');
});

// Register routes
// registerRoute(imageRoute);
// registerRoute(scriptsRoute);
// registerRoute(stylesRoute);
curryRegisterRouter(imageRoute).use(scriptsRoute).use(stylesRoute);

// to allow work offline
// respond to all navigation requests, for single page app
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
