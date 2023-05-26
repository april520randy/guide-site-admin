import request from '@/api/request'

export function selectBphy() {
  return request({
    url: '/milephy',
    method: 'get'
  })
}

export function add(data) {
  const formData = new FormData()
  formData.append('gmsPhyMile', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('imgIco', data.logoFile)
  return request({
    url: '/milephy',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function edit(data) {
  const formData = new FormData()
  formData.append('gmsPhyMile', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('imgIco', data.logoFile)
  return request({
    url: '/milephy',
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function del(ids) {
  return request({
    url: '/milephy',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }

