import request from '@/utils/request'

export function indexs() {
  return request({
    url: '/index',
    method: 'get'
  })
}
