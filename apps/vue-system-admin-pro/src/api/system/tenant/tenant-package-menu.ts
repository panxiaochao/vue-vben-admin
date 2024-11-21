import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function savePackageMenus(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/systenantpackagemenu/savePackageMenus`,
    data,
  );
}

export function queryPackageMenus(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/systenantpackagemenu/queryPackageMenus`,
    { params },
  );
}
