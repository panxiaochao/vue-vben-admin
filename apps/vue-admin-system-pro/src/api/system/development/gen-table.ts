import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gentable/page`,
    {
      params,
    },
  );
}

export async function queryDsTablePage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gentable/queryDsTablePage`,
    {
      params,
    },
  );
}

export async function queryDsTable(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gentable/queryDsTable`,
    {
      params,
    },
  );
}

export async function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gentable`,
    data,
  );
}

export async function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/gentable`,
    data,
  );
}

export async function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/gentable/${id}`,
  );
}

export async function importTables(databaseId: string, data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gentable/importTables/${databaseId}`,
    data,
  );
}
