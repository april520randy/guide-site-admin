import request from '@/api/request'

export function selectBphy() {
  return request({
    url: '/bphy',
    method: 'get'
  })
}

export function add(data) {
  console.log('新增请求参数',data)
  const formData = new FormData()
  formData.append('gmsPhyB', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('logo', data.logoFile)
  return request({
    url: '/bphy',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function edit(data) {
  console.log('修改请求参数',data)

  const formData = new FormData()
  formData.append('gmsPhyB', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }))
  formData.append('logo', data.logoFile)
  return request({
    url: '/bphy',
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/mixed' }
  })
}

export function del(ids) {
  console.log('删除请求参数',ids)
  return request({
    url: '/bphy',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }

