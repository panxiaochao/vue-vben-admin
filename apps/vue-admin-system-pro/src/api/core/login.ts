import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function login(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/web/v1/login`, data);
}
