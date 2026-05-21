import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-user/page`,
    params,
  );
}

export async function selectTenantUserPage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-user/selectTenantUserPage`,
    {
      params,
    },
  );
}

export async function selectNoExistsTenantUserPage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-user/selectNoExistsTenantUserPage`,
    {
      params,
    },
  );
}

export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sys-user`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sys-user`, data);
}

export async function deleteById(id: number) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-user/delete?id=${id}`,
  );
}
