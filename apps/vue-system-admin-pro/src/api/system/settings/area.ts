import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export function listTree(params) {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysarea/listTree`,
    { params },
  );
}

export async function update(data) {
  return requestClient.put(`${VUE_APP_API_BASE_URL}/system/v1/sysarea`, data);
}

export function selectAreaLevels() {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysarea/selectAreaLevels`,
  );
}
