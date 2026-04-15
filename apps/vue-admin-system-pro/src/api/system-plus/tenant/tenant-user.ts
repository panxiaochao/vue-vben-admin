import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function saveTenantUsers(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-tenant-user/saveTenantUsers`,
    data,
  );
}

export function deleteTenantUser(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-tenant-user/deleteTenantUser`,
    data,
  );
}
