import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/type',
    method: 'get',
    params: query
  })
}