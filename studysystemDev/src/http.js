import axios from 'axios';
//import { Message } from 'element-ui';
import router from "./router";
//axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';

//http request 拦截器
//axios.interceptors.request.use(
//	config => {
//		//	debugger
//		const token = sessionStorage.getItem('Authorization');
//		//  config.data = JSON.stringify(config.data);
//		if(token) {
//			config.headers = {
//				Authorization: token,
//				//      Accept: 'application/json, text/plain, */*'
//				//      content-type: 'application/json;charset=UTF-8'
//			};
//		}
//		// if(token){
//		//   config.params = {'token':token}
//		// }
//		return config;
//	},
//	error => {
//		return Promise.reject(err);
//	}
//);

//http response 拦截器
axios.interceptors.response.use(
	response => {
		if(response.data.ResultCode == 2200) { //如果当前用户已经被顶下线
			router.push({
				path: "/login",
				querry: {
					redirect: router.currentRoute.fullPath
				} //从哪个页面跳转
			})
			let watnText = "你当前的账户已经在别地登陆！请注意账号，密码是否已经泄露";
			alert(watnText);

		}
		return response;
	},
	error => {
		return Promise.reject(error)
	}
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
				params: params
			})
			.then(response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}