import request from '@/api/request.js'
//画像管理
export const GetEikonList = data => {
  return request('POST', 'eikon/getEikonList', data);
}
export const DoSaveAsEikonInfo = data => {
  return request('POST', 'eikon/doSaveAsEikonInfo', data);
}
export const DoUpdateAsEikonStatus = data => {
  return request('POST', 'eikon/doUpdateAsEikonStatus', data);
}
export const GetEikonVersionList = data => {
  return request('POST', 'eikon/getEikonVersionList', data);
}

//画像管理 - 左侧场景列表
export const GetEikonForLeftSceneList = data => {
  return request('POST', 'eikon/getEikonForLeftSceneList', data);
}
//画像管理 - 右侧场景列表
export const GetEikonForRightSceneList = data => {
  return request('POST', 'eikon/getEikonForRightSceneList', data);
}
//画像管理 - 发布
export const DoUpdateAsReleaseInfo = data => {
  return request('POST', 'eikon/doUpdateAsReleaseInfo', data);
}
//画像管理 - 删除
export const DoDelAsEikonInfo = data => {
  return request('POST', 'eikon/doDelAsEikonInfo', data);
}

//画像管理--新增相关
export const getEdcAttrTree = data => {
  return request('POST', 'eikon/getEdcAttrTree', data);
}
//保存
export const getEdcAttrList = data => {
  return request('POST', 'eikon/getEdcAttrList', data);
}
export const getDimValueById = data => {
  return request('POST', 'eikon/getDimValueById', data);
}
export const getEikonInfo = data => {
  return request('POST', 'eikon/getEikonInfo', data);
}