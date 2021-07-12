import request from '@/api/request.js'

//我的客户群
export const GetMySubjectList = data => {
  return request('POST', 'analyze/getMySubjectList', data);
}
//查看
export const GetViewSubjectInfo = data => {
  return request('POST', 'analyze/getViewSubjectInfo', data);
}