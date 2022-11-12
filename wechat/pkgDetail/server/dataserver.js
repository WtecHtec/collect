import Request from '../../utils/request'

export function subitFeebBack(desc) {
  return Request('/auth/createfeedback', { desc })
}