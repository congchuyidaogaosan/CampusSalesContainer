import request from '@/utils/request'

export function upload(file) {

  return request({
    url: '/file/Adminupload',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
