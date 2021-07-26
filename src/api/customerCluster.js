import request from '@/api/request.js'

//我的客户群
export const GetMySubjectList = data => {
  return request('POST', 'analyze/getMySubjectList', data);
}
//查看
export const GetViewSubjectInfo = data => {
  return request('POST', 'analyze/getViewSubjectInfo', data);
}
//
export const GetAnalyzeIndexInfo = data => {
  return request('POST', 'analyze/getAnalyzeIndexInfo', data);
}
export const GetSubjectAnalyzeGCList = data => {
  return request('POST', 'analyze/getSubjectAnalyzeGCList', data);
}
export const GetSubjectAnalyzeJZList = data => {
  return request('POST', 'analyze/getSubjectAnalyzeJZList', data);
}