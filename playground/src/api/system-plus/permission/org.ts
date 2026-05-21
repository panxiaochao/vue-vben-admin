import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-org/page`,
    params,
  );
}
export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sys-org`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sys-org`, data);
}

export async function deleteById(id: number | string | undefined) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-org/delete?id=${id}`,
  );
}

export function listTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-org/listTree`,
    {
      params,
    },
  );
}

export function tableTree(params: object | undefined) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-org/tableTree`,
    { params },
  );
}

export function list(params: object | undefined) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/sys-org/list`, {
    params,
  });
}

export function selectOrgCategoryList() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-org/selectOrgCategoryList`,
  );
}
