import { ServerMiddleware } from '@nuxt/types';

const serviceWorker: ServerMiddleware = (req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('service-worker', 'script');
  next();
};

export default serviceWorker;
