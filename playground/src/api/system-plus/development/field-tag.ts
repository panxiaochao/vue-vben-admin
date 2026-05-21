import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function selectFieldTypeByDataSourceId(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/database-field-tag/selectFieldTypeByDataSourceId`,
    { params },
  );
}

export function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/database-field-tag/page`,
    params,
  );
}

export function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/database-field-tag`,
    data,
  );
}

export function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/database-field-tag`,
    data,
  );
}

export function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/database-field-tag/${id}`,
  );
}
