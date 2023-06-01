import request from './request'

export function getHomeCount() {
  return request({
    url: '/sys/sysviewcount',
    method: 'get'
  })
}

export default { getHomeCount }
