import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function saveRoleMenus(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sysrolemenu/saveRoleMenus`,
    data,
  );
}

export function queryRoleMenus(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysrolemenu/queryRoleMenus`,
    { params },
  );
}
