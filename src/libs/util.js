export const regionIdPro = "2000250"
export const symbolListObj = {
  symbolList_A: [{
      dictCode: 8,
      dictName: "包含"
    },
    {
      dictCode: 9,
      dictName: "不包含"
    },
  ],
  symbolList_B: [{
      dictCode: 1,
      dictName: "<"
    },
    {
      dictCode: 2,
      dictName: ">"
    },
    {
      dictCode: 3,
      dictName: "="
    },
    {
      dictCode: 4,
      dictName: "<="
    },
    {
      dictCode: 5,
      dictName: ">="
    },
    {
      dictCode: 6,
      dictName: "在区间"
    },
    {
      dictCode: 7,
      dictName: "不在区间"
    },
    {
      dictCode: 12,
      dictName: "不等于"
    },
  ],
  symbolList_C: [{
      dictCode: 3,
      dictName: "="
    },
    {
      dictCode: 10,
      dictName: "like"
    },
    {
      dictCode: 11,
      dictName: "not like"
    },
    {
      dictCode: 12,
      dictName: "不等于"
    },
  ],
}


export const functionRules=[
  {title:"当前天",value:"${yyyyMMdd}"},
  {title:"当前月",value:"${yyyyMM}"},
  {title:"相对天区间",value:"${[yyyyMMdd-5, yyyyMMdd-3]}"},
  {title:"相对月区间",value:"${[yyyyMM-2, yyyyMM]}"},
  {title:"当月第x天",value:"${yyyyMM[x]}"},
  {title:"当月倒数第x天",value:"${yyyyMM[-x]}"},
  {title:"上n个月第x天",value:"${yyyyMM-n[x]}"},
  {title:"上n个月倒数第x天",value:"${yyyyMM-n[-x]}"},
  {title:"上个月第一天到上个月最后一天",value:"${[yyyyMM-1[1], yyyyMM-1[-1]]}"},
]