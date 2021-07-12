import request from '@/api/request.js'

export const Login = data => {
  return request('POST', 'login/login', data);

}
export const ValidateCode = data => {
  return request('GET', 'login/getImageCode', data, {
    responseType: 'blob'
  });
}
export const GetRsaPub = data => {
  return request('POST', 'login/getRsaPub', data);
}
