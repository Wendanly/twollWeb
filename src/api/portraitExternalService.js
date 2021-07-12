import request from '@/api/request.js'
//权限
export const GetQueryAuthList = data => {
  return request('POST', 'query/getQueryAuthList', data);
}
export const DoUpdateAsAuthStatus = data => {
  return request('POST', 'query/doUpdateAsAuthStatus', data);
}


//服务记录
export const GetQueryServeLogList = data => {
  return request('POST', 'query/getQueryServeLogList', data);
}


//服务监控
export const GetQueryServeMonitorList = data => {
  return request('POST', 'query/getQueryServeMonitorList', data);
}