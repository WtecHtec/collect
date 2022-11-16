import { upPage } from '../../server/dataserver'

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
    imgUrl: 'https://ffa.firstui.cn/api/example/upload-file',
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
   * 上传表单信息
   */
  upload_submit() {
    console.log(this.data)
    if (form) {
      form.validator(this.data, rules).then(res => {
        console.log(res)
        if (res.isPassed) {
          //上传照片
          this.startUpload()
          //校验成功后拿相关数据上传
          this._upPage(this.data);
        }
      }).catch(err => {
        console.log(err)
        this.toast('校验失败：' + err)
      })
    } else {
      this.toast('无法校验！')
    }
  },
  /*== 图片上传，具体使用请查看上传组件start ==*/
  success(e) {
    console.log(e.detail)
    //上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
    let res = JSON.parse(e.detail.res.data.replace(/\ufeff/g, "") || "{}")
    this.setData({
      status: e.detail.status
    })
    if (res.data.url) {
      //处理结果返回给组件
      //data.url为上传成功后返回的图片地址
      //e.detail.index为图片索引值
      upload && upload.result(res.data.url, e.detail.index)
    }
  },
  error(e) {
    this.setData({
      status: e.detail.status
    })
    wx.showModal({
      content: JSON.stringify(e.detail)
    })
  },
  complete(e) {
    this.setData({
      status: e.detail.status,
      urls: e.detail.urls
    })
    if (this.data.status === 'success' && e.detail.action === 'upload') {
      this.toast('上传完成！')
      //已上传完成的图片列表 this.data.urls
      console.log(this.data.urls)
    }
  },
  startUpload() {
    if (!this.data.status || this.data.status !== 'preupload') {
      this.toast('请选择需要上传的图片！')
      return
    }
    //开始上传
    upload && upload.start()
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
   * 接口
   * @param {表单数据} desc 
   */
  async _upPage(desc) {
    const [err, res] = await upPage(desc)
    if (!err && res) {
      if (res.code === 200) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      } else if (res.code === 201) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      return
    }
    wx.showToast({
      title: res.message,
      icon: 'none',
      duration: 2000
    })
  }
});