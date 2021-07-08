/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}


export function checkMaxMinNum(rule, value, callback){
  var reg = /^([1-9]\d|\d|-[1-9]\d|-\d)$/;
  if (!reg.test(value)) {
    return callback(new Error("数字必须为两位数"));
  }
  callback();
};

export function checkCN6(rule, value, callback){
  var reg = /^[\u4e00-\u9fa5]{1,6}$/;
  if (!reg.test(value)) {
    return callback(new Error("最长6个汉字"));
  }
  callback();
};

export function checkCN30(rule, value, callback){
  var reg = /^[\u4e00-\u9fa5]{1,30}$/;
  if (!reg.test(value)) {
    return callback(new Error("最长30个汉字"));
  }
  callback();
};

export function checkLimitNum1(rule, value, callback){
  var reg = /^-*\d{1}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum2(rule, value, callback){
  var reg = /^-*\d{1,2}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum3(rule, value, callback){
  var reg = /^-*\d{1,3}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum4(rule, value, callback){
  var reg = /^-*\d{1,4}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum6(rule, value, callback){
  var reg = /^-*\d{1,6}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum8(rule, value, callback){
  var reg = /^-*\d{1,8}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLimitNum12(rule, value, callback){
  var reg = /^-*\d{1,12}$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function checkLabelBegin(rule, value, callback){
  var reg = /^[a-zA-Z][a-zA-Z0-9]{5,31}$/;
  if (!reg.test(value)) {
    return callback(new Error("长度6至32位,以字母开头并且只能填写数字字母"));
  }
  callback();
};



export function checkUserName(rule, value, callback){
  var reg = /^[a-zA-Z0-9_-]{3,40}$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入由数字、26个英文字母或者下划线"));
  }
  callback();
};

export function checkPwd(rule, value, callback){
  var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
  if (!reg.test(value)) {
    return callback(new Error("8-16个字符,至少1个大写字母,1个小写字母和1个数字"));
  }
  callback();
};

export function checkPhone(rule, value, callback){
  var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的手机号码格式"));
  }
  callback();
};

export function checkBasePath(rule, value, callback){
  var reg = /^([.a-zA-Z0-9/_-]+?)[^/]$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的路径格式"));
  }
  callback();
};

export function checkIsSql(rule, value, callback){
  var reg = /^[^\u4e00-\u9fa5]+$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的SQL格式"));
  }
  callback();
};

export function getRequiredRule(name, trigger="blur"){
  return { required: true, message: `${name}必填`, trigger: trigger }
};

export function getCheckLimitMinMax(min,max, trigger="blur"){
  return { min: min, max: max,  message: `长度在 ${min} 到 ${max} 个字符`, trigger: trigger }
};

export function getNumberRule(name){
  return { type: "number", message: `${name}必须为数字` }
};


export function checkLabelNumChar(rule, value, callback){
  var reg = /^[a-z0-9A-Z\u4e00-\u9fa5]*$/;
  if (!reg.test(value)) {
    return callback(new Error(""));
  }
  callback();
};

export function getCheckLabelNumChar(){
  return {
    validator: checkLabelNumChar,
    message: "只能填写数字字母和汉字",
    trigger: "blur"
  }
}

export function getCheckLimitNum1(){
  return {
    validator: checkLimitNum1,
    message: "数字必须为一位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum2(){
  return {
    validator: checkLimitNum2,
    message: "数字最长为两位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum3(){
  return {
    validator: checkLimitNum3,
    message: "数字最长为三位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum4(){
  return {
    validator: checkLimitNum4,
    message: "数字最长为四位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum6(){
  return {
    validator: checkLimitNum6,
    message: "数字最长为六位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum8(){
  return {
    validator: checkLimitNum8,
    message: "数字最长为八位数",
    trigger: "blur"
  }
}

export function getCheckLimitNum12(){
  return {
    validator: checkLimitNum12,
    message: "数字最长为十二位数",
    trigger: "blur"
  }
}