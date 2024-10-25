import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export async function page(params) {
  return requestClient.get(`${VUE_APP_API_BASE_URL}/system/v1/syspost/page`, {
    params,
  });
}
export async function save(data) {
  return requestClient.post(`${VUE_APP_API_BASE_URL}/system/v1/syspost`, data);
}

export async function update(data) {
  return requestClient.put(`${VUE_APP_API_BASE_URL}/system/v1/syspost`, data);
}

export async function deleteById(id) {
  return requestClient.delete(
    `${VUE_APP_API_BASE_URL}/system/v1/syspost/${id}`,
  );
}

export function selectPosts() {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/syspost/selectPosts`,
  );
}
