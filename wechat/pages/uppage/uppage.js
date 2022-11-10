//校验规则
const rules = [{
  name: "name",
  rule: ["required", "isChinese", "minLength:2", "maxLength:6"],
  msg: ["请输入姓名", "姓名必须全部为中文", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
}, {
  name: "mobile",
  rule: ["required", "isMobile"],
  msg: ["请输入手机号", "请输入正确的手机号"]
}];

let form;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobile: '',
    remarks: '',
    uploadImgUrl: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    //获取表单信息
    form = this.selectComponent("#form")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 上传
   */
  upload_submit() {
    console.log(this.data)
    if (form) {
      form.validator(this.data, rules).then(res => {
        console.log(res)
        if (res.isPassed) {
          //wx.fui.toast('校验通过！')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
});