import Request from '../../utils/request'

/**
 * 获取本人发起收集的上传情况（上传人数）
 * @returns
 */
export function getCountNotice() {
  return Request('/auth/authhomenotice_sg')
}
