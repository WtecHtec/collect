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

let form, upload;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*== formData 数据start ==*/
    name: '',
    mobile: '',
    remarks: '',
    /*== formData 数据end ==*/

    //上传状态，用于保存或其他操作时做判断
    status: '',
    //上传的图片地址列表
    urls: [],
    //上传图片接口地址------------> 改，暂用默认
    uploadUrl: 'https://ffa.firstui.cn/api/example/upload-file'
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
    upload = this.selectComponent("#upload")
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
   * 上传表单信息
   */
  upload_submit() {
    console.log(this.data)
    if (form) {
      form.validator(this.data, rules).then(res => {
        console.log(res)
        //this.status === 'success'判断图片是否有上传
        if (res.isPassed && this.status === 'success') {
          //校验成功后拿相关数据上传
          postData(this.data);
        }
      }).catch(err => {
        console.log(err)
        this.toast('校验失败！')
      })
    } else {
      this.toast('无法校验！')
    }
  },
  /*== 图片上传，具体使用请查看上传组件start ==*/
  success(e) {
    console.log(e.detail)
    let res = JSON.parse(e.detail.res.data.replace(/\ufeff/g, "") || "{}")
    this.setData({
      status: e.detail.status
    })
    if (res.data.url) {
      upload && upload.result(res.data.url, e.detail.index)
    }
  },
  error(e) {
    console.log(e.detail)
    this.setData({
      status: e.detail.status
    })
    this.toast('上传失败')
  },
  complete(e) {
    this.setData({
      status: e.detail.status,
      urls: e.detail.urls
    })
    if (e.detail.status === 'success' && e.detail.action === 'upload') {
      this.toast('上传完成')
      console.log(e.detail.urls)
      this.setData({
        img: e.detail.urls.join(',')
      })
    }
  },
  //Toast轻提示
  toast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },
  /*== 图片上传，具体使用请查看上传组件End ==*/

  /**
   * 
   * @param {表单数据} data 
   */
  postData(data) {
    //接口
    data.then(res => {

    })
  }
});