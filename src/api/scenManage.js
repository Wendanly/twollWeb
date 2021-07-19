import request from '@/api/request.js'
//场景管理
export const GetSceneList = data => {
  return request('POST', 'eikon/getSceneList', data);
}
export const DoSaveAsSceneInfo = data => {
  return request('POST', 'eikon/doSaveAsSceneInfo', data);
}
export const DoDelAsSceneInfo = data => {
  return request('POST', 'eikon/doDelAsSceneInfo', data);
}
export const DoSaveAsSceneStatusInfo = data => {
  return request('POST', 'eikon/doSaveAsSceneStatusInfo', data);
}
//编辑中的一级分类，下拉
export const GetSClassList = data => {
  return request('POST', 'eikon/getSClassList', data);
}
//编辑中的二级分类，下拉
export const GetSClassList2 = data => {
  return request('POST', 'eikon/getSClassList2', data);
}
//查看
export const GetViewSceneInfo = data => {
  return request('POST', 'eikon/getViewSceneInfo', data);
}