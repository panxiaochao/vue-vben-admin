import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function preview(tableId: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen/preview/${tableId}`,
  );
}
