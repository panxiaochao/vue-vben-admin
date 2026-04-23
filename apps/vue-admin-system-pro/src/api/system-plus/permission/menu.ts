import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function tableTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-menu/tableTree`,
    { params },
  );
}

export function listTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-menu/listTree`,
    { params },
  );
}

export function queryAllTree(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-menu/queryAllTree`,
    { params },
  );
}

export function getById(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sys-menu/getById`,
    { params },
  );
}

export function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sys-menu`, data);
}

export function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sys-menu`, data);
}

export function deleteById(id: number) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sys-menu/delete?id=${id}`,
  );
}
