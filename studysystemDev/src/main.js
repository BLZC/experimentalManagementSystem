import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import PinyinMatch from 'pinyin-match';
import { post, fetch, patch, put } from "./http";
import '../public/static/UEditor/ueditor.config'
import '../public/static/UEditor/ueditor.all.min'
import '../public/static/UEditor/lang/zh-cn/zh-cn'



//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch; //get封装
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
import qs from "qs";
Vue.prototype.$pinyinmatch = PinyinMatch;
Vue.config.productionTip = false;
Vue.use(ElementUI);
axios.default.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;

// 按钮权限的存储
// Vue.directive('allow', {
// 	inserted: (el, binding, vnode) => {
// 		let permissionList = sessionStorage.getItem('Btns');
// 		if(!permissionList.includes(binding.value)) {
// 			el.parentNode.removeChild(el)
// 		}
// 	}
// })

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
