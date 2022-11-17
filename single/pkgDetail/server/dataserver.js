import Request from '../../utils/request'

/** 提交反馈 */
export function subitFeebBack(desc) {
  return Request('/auth/createfeedback', { desc })
}

/** 创建收集通知 */
export function createNotice(info) {
	return Request('/auth/authcreatenotice_sg', {...info})
}

export function getBaseNoticeInfos(info) {
  return  Request('/auth/authnoticeinfos_sg', {...info})
  
}