import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.get(`${VITE_PROJECT_API_URL}/system/v1/sysdict/page`, {
    params,
  });
}

export async function save(data: object) {
  return requestClient.post(`${VITE_PROJECT_API_URL}/system/v1/sysdict`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VITE_PROJECT_API_URL}/system/v1/sysdict`, data);
}

export async function deleteById(id: string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/system/v1/sysdict/${id}`,
  );
}

export function publishedData() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysdict/publishedData`,
  );
}