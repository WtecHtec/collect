import { createNotice, getNoticeInfossg, updateNoticeInfossg } from "../../server/dataserver";
import { PAGE_STATUS } from "../../../utils/config";
import { dispatch } from "../../../utils/event_bus";
const app = getApp();
const dayjs = require('../../../utils/day.min.js');
//校验规则
const rules = [{
  name: "title",
  rule: ["required","minLength:2", "maxLength:24"],
  msg: ["请输入标题",  "标题必须2个或以上字符", "标题不能超过24个字符"]
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
    optType: 'create',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.optType === 'update') {
      if (!options.noticeId) {
        this._redirecResult(PAGE_STATUS.opt404)
        return
      }
      this.data.noticeId = options.noticeId
      this._getNoticeInfossg()
      this.setData({ optType: options.optType })
    }
  },
  _redirecResult(errId) {
		const { noticeId } = this.data;
		wx.redirectTo({ url: `/pkgDetail/pages/notice_result/index?errId=${errId}&noticeId=${noticeId}` });
	},
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady() {
    //获取表单信息
    formCom = this.selectComponent("#form")
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
    const { optType } = this.data;
    if (formCom) {
      this.data.title = this.data.title.trim();
      this.data.remarks = this.data.remarks.trim();
      formCom.validator(this.data, rules).then(res => {
        if (res.isPassed) {
          optType === 'update' ? this._updateNoticeInfossg() : this._createNotice();
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
      dispatch('home_opt_collect')
    } else {
      wx.showToast({
        title: '创建失败',
        icon: 'error',
        duration: 2000
      })
    }
  },
  
  async _updateNoticeInfossg() {
    const { title, targetnum, date, remarks, noticeId } = this.data;
    const params = {
      title,
      notice_id: noticeId,
      desc: remarks,
      end_time: date,
      target_num: Number(targetnum),
    }
    const [err, res] = await updateNoticeInfossg(params)
    if (!err && res && res.code === 200) {
      this.setData({
        pageStatus: PAGE_STATUS.sueopt,
        noticeId: res.data,
      })
      dispatch('ino_opt_collect')
      dispatch('home_opt_collect')
    } else {
      wx.showToast({
        title: '修改失败',
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
      path: `/pages/index/index?from=collect&noticeId=${noticeId}`,
    }
  },
  async _getNoticeInfossg() {
    const { noticeId } = this.data;
    const param = {
      order: '-1',
      enable: '-1',
      notice_id: noticeId,
    }
    const [err, res] = await getNoticeInfossg(param)
    if (!err && res && res.code === 200 && Array.isArray(res.data) && res.data.length) {
        const info = res.data[0]
        this.setData({
          title: info.notice_title,
          targetnum: info.target_num,
          date: dayjs(info.end_time).format('YYYY-MM-DD'),
          remarks: info.notice_desc,
          pageStatus: PAGE_STATUS.normal,
        })
    } else {
      this._redirecResult(PAGE_STATUS.opt404)
    }
  },
})