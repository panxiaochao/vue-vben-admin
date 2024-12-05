import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function listTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysarea/listTree`,
    { params },
  );
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sysarea`, data);
}

export function selectAreaLevels() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysarea/selectAreaLevels`,
  );
}
