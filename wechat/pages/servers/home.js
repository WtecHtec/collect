import Request from '../../utils/request'
/**
 * 获取与本人相关的群
 * @param {*} code 
 * @returns 
 */
export function getGroups() {
	return Request('/auth/findgroupralebyid')
}

/**
 * 获取本人发起收集的上传情况（上传人数）
 * @returns
 */
export function getCountNotice() {
  return Request('/auth/getcountnotice')
}

export function getNewNotice() {
  return Request('/auth/hasnewnotice')
}
