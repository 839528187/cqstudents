import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/type',
    method: 'get',
    params: query
  })
}

export function parent() {
  return request({
    url: '/type/parent',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/type',
    method: 'post',
    data
  })
}
