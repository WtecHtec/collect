/*!
 * 剪贴板
 *
 * 官网地址：https://firstui.cn/
 * 文档地址：https://doc.firstui.cn/
 */
// #ifdef H5
// import ClipboardJS from "./clipboard.min.js"
// #endif

/**
 * data 需要复制的数据
 * callback 回调
 * **/
const getClipboardData = function (data, callback) {

  wx.setClipboardData({
    data: data,
    success(res) {
      ("function" == typeof callback) && callback(true)
    },
    fail(res) {
      ("function" == typeof callback) && callback(false)
    }
  })
}
export default {
  getClipboardData: getClipboardData
};