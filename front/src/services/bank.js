import request from '@/utils/request';

export async function banks() {
  return request('/api/banks');
}

export async function createBank(params) {
  return request('/api/banks', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function deleteBank(id) {
  return request('/api/bank/' + id, {method: 'DELETE'});
}

export async function updateBank(id, params) {
  return request('/api/bank/' + id, {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function getBank(id) {
  return request('/api/bank/' + id);
}
