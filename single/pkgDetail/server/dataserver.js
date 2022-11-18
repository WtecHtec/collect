import Request from '../../utils/request'

/** 提交反馈 */
export function subitFeebBack(desc) {
  return Request('/auth/createfeedback', { desc })
}

/** 创建收集通知 */
export function createNotice(info) {
	return Request('/auth/authcreatenotice_sg', {...info})
}

/**
 * 根据id获取通知信息
 * @param {*} id 
 * @returns 
 */
export function getBaseNoticeById(id) {
  return  Request('/auth/authgetnoticebyid_sg', { notice_id: id })
}

/**
 * 根据id获取上传信息
 * @param {*} id 
 * @returns 
 */
export function getMsgCollectById(id) {
	return  Request('/auth/getmsgcollectbyid_sg', { notice_id: id })
}

/**
 * 上传收集信息
 * @param {*} id 
 * @returns 
 */
 export function createMsgCollectsg(info) {
	return  Request('/auth/createcollect_sg', { ...info })
}

/**
 * 修改收集信息
 * @param {*} id 
 * @returns 
 */
 export function updateMsgCollectsg(info) {
	return  Request('/auth/updatecollect_sg', { ...info })
}

/**
 * 获取收集通知 info
 * notice_id：'-1' 不判断条件
	enable ：'-1' 不判断条件（1, 0）
	order：'-1' 不判断条件（）
 * @param {*} id 
 * @returns 
 */
export function getNoticeInfossg(info) {
	return  Request('/auth/authnoticeinfos_sg', { ...info })
}

/**
 * 更新收集通知
 * @param {*} info 
 * @returns 
 */
export function updateNoticeInfossg(info) {
	return  Request('/auth/authupdatenotice_sg', { ...info })
}

/** 获取通知收集详情 */
export function getMsgCollectsg(id) {
	return  Request('/auth/getmsgcollectbynotice_sg',{ notice_id: id })
}

/** 获取我的上传收集详情 */
export function getNoticeRaleOwnsg(collectId, order) {
	return  Request('/auth/getnoticeraleown_sg', {
    order: order || '1',
    collect_id: collectId || '-1',
  })
}
