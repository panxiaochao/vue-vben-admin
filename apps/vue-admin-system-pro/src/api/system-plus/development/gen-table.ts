import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/page`,
    params,
  );
}

export async function get(id: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/${id}`,
  );
}

export async function queryDsTablePage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/queryDsTablePage`,
    {
      params,
    },
  );
}

export async function queryDsTable(params: object | undefined) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/queryDsTable`,
    {
      params,
    },
  );
}

export async function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table`,
    data,
  );
}

export async function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table`,
    data,
  );
}

export async function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/${id}`,
  );
}

export async function importTables(databaseId: string, data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/importTables/${databaseId}`,
    data,
  );
}

export async function syncTable(id: Array<number | string> | number | string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table/syncTable/${id}`,
  );
}
