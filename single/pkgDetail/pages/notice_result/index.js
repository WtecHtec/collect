// pkgDetail/pages/notice_result/index.js
import { PAGE_STATUS } from "../../../utils/config"
const PAGE_MAPS = {
	[PAGE_STATUS.empty]: {
		errId: PAGE_STATUS.empty,
		desc: '无收集数据'
	},
	[PAGE_STATUS.opt404]: {
		errId: PAGE_STATUS.opt404,
		desc: '数据不存在'
	},
	[PAGE_STATUS.opt405]: {
		errId: PAGE_STATUS.opt405,
		desc: '已上传数据',
		btn: '去修改',
		optType: 'msg_update',
	},
	[PAGE_STATUS.sueopt]: {
		errId: PAGE_STATUS.sueopt,
		desc: '上传数据成功'
	},
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
		errInfo: {},
		noticeId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({ errInfo:  PAGE_MAPS[options.errId]})
		if (options.noticeId) this.data.noticeId = options.noticeId
  },
	bindOpt() {
		const { errInfo, noticeId } = this.data
		if (errInfo.optType === 'msg_update') {
			wx.redirectTo({ url: `/pkgDetail/pages/msg_collect/index?noticeId=${noticeId}&optType=update`})
		}
	}
})