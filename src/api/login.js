import request from '@/api/request.js'

export const Login = data => {
  return request('POST', 'login/login', data);

}
export const ValidateCode = data => {
  return request('GET', 'login/getImageCode', data, {
    responseType: 'blob'
  });

}
export const CheckCode = data => {
  return request('POST', `checkCode/${data}`, {});

}
export const UserInfo = data => {
  return request('POST', 'userInfo', data);

}
export const GetMenuList = data => {
  return request('POST', 'getMenuList', data);

}
export const GetRsaPub = data => {
  return request('POST', 'login/getRsaPub', data);
}
export const Logout = data => {
  return request('POST', 'logout', data);

}