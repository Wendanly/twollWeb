import request from '@/api/request.js'
//标签管理
export const GetLabelList = data => {
  return request('POST', 'label/getLabelList', data);
}