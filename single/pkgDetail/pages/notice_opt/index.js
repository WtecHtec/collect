import { createNotice } from "../../server/dataserver";
import { PAGE_STATUS } from "../../../utils/config";
import { dispatch } from "../../../utils/event_bus";
const app = getApp();
const dayjs = require('../../../utils/day.min.js');
//校验规则
const rules = [{
  name: "title",
  rule: ["required","minLength:2", "maxLength:24"],
  msg: ["请输入标题",  "标题必须2个或以上字符", "姓名不能超过24个字符"]
}, {
  name: "targetnum",
  rule: ["required", "isNumber"],
  msg: ["请输入总人数", "请输入数字"]
}];

let formCom = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStatus: PAGE_STATUS.normal,
    title: '',
    targetnum: '',
    remarks: '',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    noticeId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('===', this.data.date)
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady() {
    //获取表单信息
    formCom = this.selectComponent("#form")
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
    console.log('onunload')
  },
  bindDateChange(event) {
    this.setData({
      date: event.detail.value
    })
  },
  bindSubmit() {
    if (formCom) {
      this.data.title = this.data.title.trim();
      this.data.remarks = this.data.remarks.trim();
      formCom.validator(this.data, rules).then(res => {
        if (res.isPassed) {
          this._createNotice();
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  async _createNotice() {
    const { title, targetnum, date, remarks } = this.data;
    const params = {
      title,
      desc: remarks,
      end_time: date,
      target_num: Number(targetnum),
    }
    const [err, res] = await createNotice(params)
    if (!err && res && res.code === 200) {
      this.setData({
        pageStatus: PAGE_STATUS.sueopt,
        noticeId: res.data,
      })
      dispatch('opt_collect')
    } else {
      wx.showToast({
        title: '创建失败',
        icon: 'error',
        duration: 2000
      })
    }
  },
  onShareAppMessage() {
    const { noticeId } = this.data;
    let Name = ''
    try {
       Name = app.globalData.userInfo.Name
    } catch(er) {

    }
    return {
      title: `${Name}邀请您参加收集活动`,
      path: `/pages/index/index?from=collect&noticeid=${noticeId}`,
    }
  }
})