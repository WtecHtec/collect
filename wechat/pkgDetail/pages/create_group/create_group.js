// pkgDetail/pages/create_group/create_group.js
import { createGroup } from '../../server/dataserver'

//校验规则
const rules = [{
  name: "name",
  rule: ["required", "minLength:2", "maxLength:16"],
  msg: ["请输入团队名称", "团队名称必须2个或以上字符", "团队名称不能超过16个字符"]
}];

let form;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*== formData 数据start ==*/
    name: '',
    enable_status: true,
    desc: '',
    /*== formData 数据end ==*/
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    //获取表单信息
    form = this.selectComponent("#form")
  },

  /**
   * 是否可用开关状态
   * @param {*} e 
   */
  switch_change(e) {
    this.setData({
      enable_status: e.detail.value
    })
  },

  /**
   * 创建团体
   */
  create_group_submit() {
    console.log(this.data)
    if (form) {
      form.validator(this.data, rules).then(res => {
        console.log(res)
        if (res.isPassed) {
          //接口
          this._createGroup(this.data);
        }
      }).catch(err => {
        console.log(err)
        this.toast('校验失败：' + err)
      })
    } else {
      this.toast('无法校验！')
    }
  },
  //Toast轻提示
  toast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },

  /**
   * 接口
   * @param {表单数据} desc 
   */
  async _createGroup(desc) {
    const [err, res] = await createGroup(desc)
    if (!err && res) {
      if (res.code === 200) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      } else if (res.code === 203) {
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

})