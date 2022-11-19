import { postUpdateUserInfo, postUserInfo, NavToPage } from "../servers/login";
import { setStorage } from '../../utils/util';
import { PAGE_STATUS } from '../../utils/config'
import { USERINFO_KEY } from '../../utils/storage-keys'
const app = getApp()
//校验规则
const rules = [{
  name: "name",
  rule: ["required", "isChinese", "minLength:2", "maxLength:6"],
  msg: ["请输入昵称", "昵称必须全部为中文", "昵称必须2个或以上字符", "昵称不能超过6个字符"]
}, {
  name: "mobile",
  rule: ["required", "isMobile"],
  msg: ["请输入帐号", "请输入11位数帐号"]
}];

let formCom = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "*为了更好的体验小程序功能,请您完善帐号信息",
    name: '',
    mobile: '',
    gender: 'M',
    from: 'init',
    noticeId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    options.from && (this.data.from = options.from);
    options.noticeId && (this.data.noticeId = options.noticeId)
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
    wx.hideHomeButton()
  },

  bindSubmit() {
    if (formCom) {
      this.data.name = this.data.name.trim()
      formCom.validator(this.data, rules).then(res => {
        if (res.isPassed) {
          this._postUpdateUserInfo();
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  async _postUpdateUserInfo() {
    const { name, mobile, gender } = this.data;
    const params = {
      user_name: name,
      phone_numer: mobile,
      user_gender: gender,
    }
    const [err, res ] = await postUpdateUserInfo(params)
    if (!err && res && res.code === 200) {
      this._postUserInfo()
    } else {
      wx.showToast({
        title: '帐号已存在',
        icon: 'error',
        duration: 2000
      })
    }
  },
  async _postUserInfo() {
    const { from, noticeId } = this.data
    const [err, res] = await postUserInfo();
    if (!err && res && res.code === 200 && res.data) {
      const { PhoneNumer } = res.data || {}
      this.setData({ pageStatus: PAGE_STATUS.normal })
      if ( PhoneNumer ) {
        setStorage(USERINFO_KEY, res.data)
        app.globalData.userInfo = res.data
        NavToPage(from, noticeId)
      } else {
        // 注册页
        wx.redirectTo({ url: `/pages/registe/index?from=${from}&noticeId=${noticeId}` });
      }
    } else {
      this._showError();
    }
  },
  _showError() {
    wx.showToast({
      title: '异常错误',
      icon: 'error',
      duration: 2000
    })
  },

})