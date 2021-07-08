export const getRandomId = () => {
  return new Date().getTime();
}
const relMap = {
  "11": "且",
  "12": "或",
  "13": "剔除",
}

const getLabelName = (item) => {
  if (item.hasOwnProperty("relation")) {
    return relMap[item.relation];
  } else {
    return item.operand.name;
  }
}

const relSmallMap = {
  "且": "relaSmallType_11",
  "或": "relaSmallType_12",
  "剔除": "relaSmallType_13",
}

const getCaretClass = (caret) => {
  return relSmallMap[caret];
}

export const generateCode = (array, code, caret = "且") => {
  for (let i = 0; i < array.length; i++) {
    let name = getLabelName(array[i]);
    if (name == "或" || name == "且" || name == "剔除") {
      code.str += "<span class='t_red'>{</span>";
      let children = array[i].children;
      if (children && children.length != 0) {
        generateCode(children, code, name);
      }
      code.str += "<span class='t_red'>}</span>";
      if (i != array.length - 1) {
        code.str += `<span class='icon-or-text ${getCaretClass(caret)}'>${caret}</span>`;
      }
    } else {
      code.str += `<span class='t_orange'>${name}</span>`;
      if (i != array.length - 1) {
        code.str += `<span class='icon-or-text ${getCaretClass(caret)}'>${caret}</span>`;
      }
    }
  }
}
export const dealDateStr = (str) => {
  let ret = "";
  let year = str.slice(0, 4);
  let month = str.slice(4, 6);
  let day = str.slice(6, 8);
  if (year != "") {
    ret = ret + year;
  }
  if (month != "") {
    ret = ret + "/" + month;
  }
  if (day != "") {
    ret = ret + "/" + day;
  }
  return ret;
}
export const isNullOrEmpty = (val) => {
  if (val == null || val === "") return true;
  return false;
}

const checkFuncRuleIsRange = (expressionVal) => {
  if (isNullOrEmpty(expressionVal)) {
    return false;
  }
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  if (reg.test(expressionVal)) {
    return false;
  }
  var regEx = /^\$\{.+\}$/
  if (!regEx.test(expressionVal)) {
    return false;
  }

  if (expressionVal.indexOf(",") != -1) {
    return true;
  } else {
    return false;
  }
}

const checkFuncRuleIsSingle = (expressionVal) => {
  if (isNullOrEmpty(expressionVal)) {
    return false;
  }
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  if (reg.test(expressionVal)) {
    return false;
  }
  var regEx = /^\$\{.+\}$/
  if (!regEx.test(expressionVal)) {
    return false;
  }
  if (expressionVal.indexOf(",") != -1) {
    return false;
  } else {
    return true;
  }
}

export const checkLogicTree = (TreeObj, result) => {
  if (Array.isArray(TreeObj)) {
    for (let i = 0; i < TreeObj.length; i++) {
      if (TreeObj[i].hasOwnProperty("relation")) {
        checkLogicTree(TreeObj[i].children, result);
      } else if (
        isNullOrEmpty(TreeObj[i].expressionVal) ||
        isNullOrEmpty(TreeObj[i].operand) ||
        isNullOrEmpty(TreeObj[i].symbol) ||
        (TreeObj[i].type == "C" && (TreeObj[i].symbol == 6 || TreeObj[i].symbol == 7) && isNullOrEmpty(TreeObj[i].expressionVal.max)) ||
        (TreeObj[i].type == "C" && (TreeObj[i].symbol == 6 || TreeObj[i].symbol == 7) && isNullOrEmpty(TreeObj[i].expressionVal.min)) ||
        (TreeObj[i].type == "B" && TreeObj[i].changeTimeControlVal == "1" && (TreeObj[i].symbol == 6 || TreeObj[i].symbol == 7) && !checkFuncRuleIsRange(TreeObj[i].expressionVal)) ||
        (TreeObj[i].type == "B" && TreeObj[i].changeTimeControlVal == "1" && (TreeObj[i].symbol != 6 && TreeObj[i].symbol != 7) && !checkFuncRuleIsSingle(TreeObj[i].expressionVal)) ||
        (Array.isArray(TreeObj[i].expressionVal) && TreeObj[i].expressionVal.length == 0)
      ) {
        if ((TreeObj[i].operand == null) || (TreeObj[i].operand && TreeObj[i].operand.type != 2)) {
          result.bool = false;
        }
      }
    }
  } else if (TreeObj.hasOwnProperty("relation")) {
    checkLogicTree(TreeObj.children, result);
  }
}
//大写带下划线转驼峰，如：REG_NAME 结果为：regName
export const transHump = list => {
  list.map(o => {
    for (let i in o) {
      let key = '';
      let tmp = i.split('_');
      let lowcaseList = [];
      tmp.map(m =>
        lowcaseList.push(m.toLowerCase()));
      if (lowcaseList.length > 1) {
        for (let i = 1, len = lowcaseList.length; i < len; i++) {
          lowcaseList[i] = lowcaseList[i].slice(0, 1).toUpperCase() + lowcaseList[i].slice(1)
        }
      }
      key = lowcaseList.join('');
      o[key] = o[i];
    }
  });
  // console.log(list);
  return list;
}