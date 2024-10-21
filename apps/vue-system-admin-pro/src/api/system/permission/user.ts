import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export async function page(params) {
  return requestClient.get(`${VUE_APP_API_BASE_URL}/system/v1/sysuser/page`, {
    params,
  });
}
