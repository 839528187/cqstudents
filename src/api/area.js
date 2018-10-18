import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/area',
    method: 'get',
    params: query
  })
}

export function operating(id) {
  return request({
    url: '/area/' + id,
    method: 'put'
  })
}
