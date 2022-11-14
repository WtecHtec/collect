import Request from '../../utils/request'

/** 提交反馈 */
export function subitFeebBack(desc) {
  return Request('/auth/createfeedback', { desc })
}

/** 获取通知 */
export function getNotices() {
	return Request('/auth/getnotices')
}