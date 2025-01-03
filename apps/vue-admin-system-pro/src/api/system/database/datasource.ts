import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function selectDbSources() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource/selectDbSources`,
  );
}

export function testConn(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource/testConn`,
    data,
  );
}

export function selectJavaTypes() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource/selectJavaTypes`,
  );
}

export function page(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource/page`,
    { params },
  );
}

export function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource`,
    data,
  );
}

export function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource`,
    data,
  );
}

export function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/system/v1/databasesource/${id}`,
  );
}
