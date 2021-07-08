import Vue from 'vue'
let globalVar = {
    PAGE_SIZES: [10, 20, 50, 100],
    TABLEHEIGHT: '243',
};
export default globalVar
for (let i in globalVar) {
    Vue.prototype['$' + i] = globalVar[i];
}