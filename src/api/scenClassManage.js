import request from '@/api/request.js'
//场景分类管理
export const GetSceneClassList = data => {
  return request('POST', 'eikon/getSceneClassList', data);

}
export const DoSaveAsSceneClassInfo = data => {
  return request('POST', 'eikon/doSaveAsSceneClassInfo', data);

}
export const DoDelAsSceneClassInfo = data => {
  return request('POST', 'eikon/doDelAsSceneClassInfo', data);

}