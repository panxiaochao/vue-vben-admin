import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/page`,
    params,
  );
}

export async function get(id: string) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/${id}`,
  );
}

export async function save(data: object) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template`,
    data,
  );
}

export async function update(data: object) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template`,
    data,
  );
}

export async function deleteById(id: Array<number | string> | number | string) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/${id}`,
  );
}

export function selectTemplateTypes() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/selectTemplateTypes`,
  );
}

export function selectTemplateList() {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/selectTemplateList`,
  );
}

export async function copy(id: string) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/development/v1/gen-template/copy/${id}`,
  );
}
