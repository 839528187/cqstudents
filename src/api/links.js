import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/links',
    method: 'get',
    params: query
  })
}
