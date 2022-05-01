import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  matchPrecache,
} from 'workbox-precaching';
import {
  Route,
  registerRoute,
  NavigationRoute,
  setCatchHandler,
} from 'workbox-routing';
import {
  CacheFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);
const FALLBACK_HTML_URL = '/offline.html';
const FALLBACK_IMAGE_URL = '/offline-image.png';

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

// 用于捕获routing的错误
setCatchHandler(async ({ request }) => {
  let offline;
  switch (request.destination) {
    case 'document':
      offline = matchPrecache(FALLBACK_HTML_URL);
      return offline ? offline : Response.error();
    case 'image':
      offline = matchPrecache(FALLBACK_IMAGE_URL);
      return offline ? offline : Response.error();
    default:
      return Response.error();
  }
});

// 离线发送失败的请求等待联网再次发送
const bgSyncPlugin = new BackgroundSyncPlugin('failedQueue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

// 对/api没有联网时的请求进行存储
const apiRoute = new Route(
  ({ url }) => {
    return /\/api\/login/.test(url.pathname);
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

curryRegisterRouter(imageRoute)
  .use(scriptsRoute)
  .use(stylesRoute)
  .use(apiRoute);

// to allow work offline
// respond to all navigation requests, for single page app
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
