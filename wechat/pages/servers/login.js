
import Request from '../../utils/request'
import { setStorage } from '../../utils/util'

/**
 * 获取微信登陆code
 * @returns 
 */
export function getLoginCode() {
	return new Promise(resolve => {
		wx.login({
			success (res) {
				if (res && res.code) {
					resolve(res.code)
				}
				resolve(null)
			},
			fail() {
				resolve(null)
			}
		})
	})
};

/**
 * 请求登陆
 * @param {*} code 
 * @returns 
 */
export function postLogin(code) {
	return Request('/login', { code })
}

/**
 * 检查登录态
 * @returns 
 */
export function postCheckLogin() {
	return Request('/auth/refresh_token');
}
