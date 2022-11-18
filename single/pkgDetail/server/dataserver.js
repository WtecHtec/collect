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
