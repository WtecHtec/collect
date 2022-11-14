import { PAGE_STATUS } from '../../../utils/config'
import { getNotices } from '../../server/dataserver'
const dayjs = require('../../../utils/day.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		noticeDatas: [],
		pageStatus: PAGE_STATUS.loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this._getNotices()
  },
	async _getNotices() {
		const [err, res] = await getNotices()
		if (!err && res) {
			 if (res.code === 200 && Array.isArray(res.data)) {
				res.data.forEach(item => {
					if (item.update_time) {
						item.update_time_str =  dayjs(item.update_time).format('YYYY-MM-DD')
					}
					if (item.end_time) {
						item.end_time_str =  dayjs(item.end_time).format('YYYY-MM-DD')
					}
				})
				console.log('res.data--', res.data)
				this.setData({
					noticeDatas: res.data,
					pageStatus:  res.data.length ? PAGE_STATUS.normal :  PAGE_STATUS.empty
				});
			 } else {
				this.setData({
					pageStatus: PAGE_STATUS.error
				});
			 }
		} else {
			this.setData({
				pageStatus: PAGE_STATUS.nonetwork
			});
		}
	},
	navCollectOpt() {
		wx.navigateTo({ url: '/pkgDetail/pages/uppage/uppage'})
	}
})