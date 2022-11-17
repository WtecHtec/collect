import Request from '../../utils/request'

/** 提交反馈 */
export function subitFeebBack(desc) {
  return Request('/auth/createfeedback', { desc })
}

/** 获取通知 */
export function getNotices() {
  return Request('/auth/getnotices')
}

/** 创建团体 */
export function createGroup(desc) {
  return Request('/auth/creategroup', { desc })
}

/** 上传健康码和基本信息 */
export function upPage(desc) {
  return Request('/auth/authupload', { desc })
}