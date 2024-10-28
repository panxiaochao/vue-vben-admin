import { requestClient } from '#/api/request';

const VUE_APP_API_BASE_URL = 'http://localhost:8081';

export function save(data) {
  return requestClient.post(
    `${VUE_APP_API_BASE_URL}/system/v1/sysuserrole`,
    data,
  );
}

export function getById(id) {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysuserrole/${id}`,
  );
}

export function rolesByUserId(params) {
  return requestClient.get(
    `${VUE_APP_API_BASE_URL}/system/v1/sysuserrole/rolesByUserId`,
    { params },
  );
}
