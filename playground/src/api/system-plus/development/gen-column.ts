import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/page`,
    params,
  );
}

export async function get(id: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/${id}`,
  );
}

export async function queryDsTablePage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/queryDsTablePage`,
    {
      params,
    },
  );
}

export async function queryDsTable(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/queryDsTable`,
    {
      params,
    },
  );
}

export async function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column`,
    data,
  );
}

export async function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column`,
    data,
  );
}

export async function updateBatch(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/updateBatch`,
    data,
  );
}

export async function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/${id}`,
  );
}

export function queryTableColumnList(tableId: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/queryTableColumnList/${tableId}`,
  );
}

export function selectAttrTypes() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-table-column/selectAttrTypes`,
  );
}
