import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/syspost/page`, {
    params,
  });
}
export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/syspost`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/syspost`, data);
}

export async function deleteById(id: number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/system/v1/syspost/${id}`,
  );
}

export function selectPosts() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/syspost/selectPosts`,
  );
}
