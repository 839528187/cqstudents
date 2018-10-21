import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/school',
    method: 'get',
    params: query
  })
}
