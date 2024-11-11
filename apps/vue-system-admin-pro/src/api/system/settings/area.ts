import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function listTree(params) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysarea/listTree`,
    { params },
  );
}

export async function update(data) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sysarea`, data);
}

export function selectAreaLevels() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysarea/selectAreaLevels`,
  );
}
