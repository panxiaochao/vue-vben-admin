import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export async function page(params: any) {
  return requestClient.get(`${VUE_APP_API_BASE_URL}/system/v1/sysorg/page`, {
    params,
  });
}
export async function save(data: any) {
  return requestClient.post(`${VUE_APP_API_BASE_URL}/system/v1/sysorg`, data);
}

export async function update(data: any) {
  return requestClient.put(`${VUE_APP_API_BASE_URL}/system/v1/sysorg`, data);
}

export async function deleteById(id: any) {
  return requestClient.delete(`${VUE_APP_API_BASE_URL}/system/v1/sysorg/${id}`);
}

export function listTree(params: any) {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysorg/listTree`,
    {
      params,
    },
  );
}
