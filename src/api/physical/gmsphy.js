import request from '@/api/request'

export function selectBphy() {
  return request({
    url: 'bphyh',
    method: 'get'
  })
}

export function add(data) {
  const formData = new FormData()
  formData.append('phy', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('logo', data.logoFile)
  return request({
    url: '/bphyh',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function edit(data) {
  const formData = new FormData()
  formData.append('phy', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('logo', data.logoFile)
  return request({
    url: '/bphyh',
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function del(ids) {
  return request({
    url: '/bphyh',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }

