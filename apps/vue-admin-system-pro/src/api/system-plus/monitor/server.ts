import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

// ----------------------------- 系统监控 -----------------------------
export function monitorInfo() {
  return requestClient.get(`${VITE_PROJECT_API_URL}/web/v1/server`);
}

export function networkInterfaces() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/web/v1/server/networkInterfaces`,
  );
}

// ----------------------------- Redis监控 -----------------------------
export function redisCache() {
  return requestClient.get(`${VITE_PROJECT_API_URL}/web/v1/redis/cache`);
}
