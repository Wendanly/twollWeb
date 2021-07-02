import request from '@/api/request.js'

export const GetDicInfo = function (data) {
  return request('POST', 'comm/getDicInfo', data);

}