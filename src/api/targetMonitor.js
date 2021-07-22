import request from '@/api/request.js'

//监控指标

//列表查询
export const GetRtaSubjectList = data => {
  return request('POST', 'label/getRtaSubjectList', data);
}