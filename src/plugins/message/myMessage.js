import Vue from 'vue';
import confirm from './myMessage.vue';
let confirmConstructor = Vue.extend(confirm);
let confirmDom = new confirmConstructor({
    el: document.createElement('div'),
});

let dom = document.createElement('div');
console.log(dom);
dom.setAttribute('style', "position: fixed;left: 50%;top: 40px;z-index: 10000;transform: translate(-50%, -50%); /* 50%为自身尺寸的一半 */border: 1px solid red;");
dom.innerHTML = '哈哈';
let theConfirm = content => {
    // document.body.appendChild(dom); //new一个对象，然后插入body里面
    document.body.appendChild(confirmDom.$el); //new一个对象，然后插入body里面
    return new Promise((reso, rej) => {
        //promise封装，ok执行resolve，no执行reject
        confirmDom.content = content; //为了使confirm的扩展性更强，这个采用对象的方式传入，所有的字段都可以根据需求自定义
        confirmDom.isShow = true;
        confirmDom.$on('comfir', (res) => {
            console.log(res);
            reso(res)
        });
        confirmDom.$on('fail', (res) => {
            console.log(res);
            rej(res)
        });
        dom.onclick = () => {
            console.log(12);
            reso('点击了');
        }

    })
}
Vue.prototype.$myMessage = theConfirm;
// export default theConfirm;