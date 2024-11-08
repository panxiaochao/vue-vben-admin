import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export async function page(params: object) {
  return requestClient.get(`${VUE_APP_API_BASE_URL}/system/v1/sysdict/page`, {
    params,
  });
}

export function publishedData() {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysdict/publishedData`,
  );
}

export async function save(data: object) {
  return requestClient.post(`${VUE_APP_API_BASE_URL}/system/v1/sysdict`, data);
}

export async function update(data: object) {
  return requestClient.put(`${VUE_APP_API_BASE_URL}/system/v1/sysdict`, data);
}

export async function deleteById(id: string) {
  return requestClient.delete(
    `${VUE_APP_API_BASE_URL}/system/v1/sysdict/${id}`,
  );
}
