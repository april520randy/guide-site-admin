import request from './request'

export function getHomeCount() {
  return request({
    url: '/sys/sysviewcount',
    method: 'get'
  })
}

export function sysClickcount() {
  return request({
    url: '/sys/sysClickcount',
    method: 'get'
  })
}

export default { getHomeCount,sysClickcount }
