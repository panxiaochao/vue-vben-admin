import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/sysorg/page`, {
    params,
  });
}
export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sysorg`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sysorg`, data);
}

export async function deleteById(id: number | string | undefined) {
  return requestClient.delete(`${VITE_PROJECT_API_URL}/system/v1/sysorg/${id}`);
}

export function listTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysorg/listTree`,
    {
      params,
    },
  );
}

export function tableTree(params: object | undefined) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysorg/tableTree`,
    { params },
  );
}

export function list(params: object | undefined) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/sysorg/list`, {
    params,
  });
}

export function selectOrgCategoryList() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysorg/selectOrgCategoryList`,
  );
}
