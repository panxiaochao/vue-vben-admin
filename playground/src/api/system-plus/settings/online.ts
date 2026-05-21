import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function tokenPage(params: object) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/web/v1/token/page`, {
    params,
  });
}

export function removeToken(token: string) {
  return requestClient.delete(`${VITE_PROJECT_API_URL}/web/v1/remove/${token}`);
}
