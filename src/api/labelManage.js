import request from '@/api/request.js'
//标签管理
export const GetLabelList = data => {
  return request('POST', 'label/getLabelList', data);
}
//申请
export const DoSaveAsp2GPortraitResult = data => {
  return request('POST', 'label/doSaveAsp2GPortraitResult', data);
}