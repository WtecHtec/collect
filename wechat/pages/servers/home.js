import Request from '../../utils/request'
/**
 * 请求登陆
 * @param {*} code 
 * @returns 
 */
 export function getGroups() {
	return Request('/auth/findgroupralebyid')
}