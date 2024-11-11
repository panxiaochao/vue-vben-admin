import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function monitorInfo() {
  return requestClient.get(`${VITE_PROJECT_API_URL}/web/v1/server`);
}

export function networkInterfaces() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/web/v1/server/networkInterfaces`,
  );
}
