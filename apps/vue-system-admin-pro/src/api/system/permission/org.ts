import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: any) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/sysorg/page`, {
    params,
  });
}
export async function save(data: any) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sysorg`, data);
}

export async function update(data: any) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sysorg`, data);
}

export async function deleteById(id: any) {
  return requestClient.delete(`${VITE_PROJECT_API_URL}/system/v1/sysorg/${id}`);
}

export function listTree(params: any) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysorg/listTree`,
    {
      params,
    },
  );
}
