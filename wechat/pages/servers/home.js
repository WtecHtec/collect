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
  return Request('/auth/authcountnotice')
}

/**
 * 获取本人创建群的总人数
 * @returns
 */
export function getCountGroupNum() {
  return Request('/auth/countgrouptotal')
}

/**
 * 获取本人发起收集数量
 */
 export function getOwnNotices() {
  return Request('/auth/authownnotice')
}