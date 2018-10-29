import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/entourage',
    method: 'get',
    params: query
  })
}
