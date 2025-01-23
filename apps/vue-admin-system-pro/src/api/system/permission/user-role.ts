import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/sysuserrole`,
    data,
  );
}

export function getById(id: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysuserrole/${id}`,
  );
}

export function rolesByUserId(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/sysuserrole/rolesByUserId`,
    { params },
  );
}
