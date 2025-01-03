import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function queryDsTablePage(params: object) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/codegen/v1/gentable/queryDsTablePage`,
    {
      params,
    },
  );
}
