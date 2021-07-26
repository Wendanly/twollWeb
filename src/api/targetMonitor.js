import request from '@/api/request.js'

//监控指标

//列表查询
export const GetRtaSubjectList = data => {
  return request('POST', 'analyze/getRtaSubjectList', data);
}
//删除
export const DoDelAsRtaSubject = data => {
  return request('POST', 'analyze/doDelAsRtaSubject', data);
}
//详情
export const GetRtaSubjectInfo = data => {
  return request('POST', 'analyze/getRtaSubjectInfo', data);
}
//保存
export const DoSaveAsRtaSubject = data => {
  return request('POST', 'analyze/doSaveAsRtaSubject', data);
}
//已选
export const GetSelSubjectRelList = data => {
  return request('POST', 'analyze/getSelSubjectRelList', data);
}
//数据源
export const GetSubjectList = data => {
  return request('POST', 'analyze/getSubjectList', data);
}
//分析
export const GetRtaPicInfo = data => {
  return request('POST', 'analyze/getRtaPicInfo', data);
}