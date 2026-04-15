import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export function selectDbSources() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/selectDbSources`,
  );
}

export function selectDataSourceList() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/selectDataSourceList`,
  );
}

export function testConn(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/testConn`,
    data,
  );
}

export function selectJavaTypes() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/selectJavaTypes`,
  );
}

export function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/page`,
    params,
  );
}

export function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/data-source`,
    data,
  );
}

export function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/data-source`,
    data,
  );
}

export function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/data-source/${id}`,
  );
}
