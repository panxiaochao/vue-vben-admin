import { requestClient } from '#/api/request';

const { VITE_PROJECT_API_URL } = import.meta.env;

export async function page(params) {
  return requestClient.get(
    `${VITE_PROJECT_API_URL}/system/v1/syslogoperate/page`,
    {
      params,
    },
  );
}
export async function save(data) {
  return requestClient.post(
    `${VITE_PROJECT_API_URL}/system/v1/syslogoperate`,
    data,
  );
}

export async function update(data) {
  return requestClient.put(
    `${VITE_PROJECT_API_URL}/system/v1/syslogoperate`,
    data,
  );
}

export async function deleteById(id) {
  return requestClient.delete(
    `${VITE_PROJECT_API_URL}/system/v1/syslogoperate/${id}`,
  );
}
