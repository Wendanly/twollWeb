import request from '@/api/request.js'

export const GetDicInfo = data => {
  return request('POST', 'comm/getDicInfo', data);

}