import request from '@/api/request.js'
//画像管理
export const GetEikonList = data => {
  return request('POST', 'eikon/getEikonList', data);
}