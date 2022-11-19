import { PAGE_STATUS } from "../../../utils/config";
import { getBaseNoticeById, getMsgCollectById, createMsgCollectsg, updateMsgCollectsg } from "../../server/dataserver";
import { BASE_URL, mode } from "../../../config";
import { getStorage } from "../../../utils/util";
import { MINIKET_KEY } from '../../../utils/storage-keys'
const dayjs = require('../../../utils/day.min.js');
const minikey = getStorage(MINIKET_KEY) || '';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    noticeId: '',
		remarks: '',
    pageStatus: PAGE_STATUS.loading,
		optType: 'create',
		uploadUrl: `${BASE_URL[mode]}/auth/authupload`,
		baseUrl: BASE_URL[mode],
		header: {
			Authorization: `Bearer ${minikey}`
		},
		fileList:[],
		imgUrls: [],
		uploadLen: -1,
		msgCollect: {},
		uploadImgs: [],
    noticeInfo: {},
		formData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if (!options.noticeId) {
      this._redirecResult(PAGE_STATUS.empty)
      return
    }
		if (options.optType) this.data.optType = options.optType
    this.data.noticeId = options.noticeId
		const [has, noticeInfo ] = await this._getBaseNoticeById()
		if (!has) {
			this._redirecResult(PAGE_STATUS.empty)
      return
		}
    if (noticeInfo.end_time) {
      noticeInfo.source = '结束时间'
      noticeInfo.time = dayjs(noticeInfo.end_time).format('YYYY-MM-DD HH:mm:ss')
    } 
		const [ok, msgCollect] = await this._getMsgCollectById()
		let updObj = {}
		const { baseUrl, optType} = this.data
		if (ok ) {
			if (optType === 'create') {
				this._redirecResult(PAGE_STATUS.opt405)
				return
			} else if (optType === 'update') {
				this.data.msgCollect = msgCollect;
				let fileList = msgCollect.img_urls ? msgCollect.img_urls.split(';') : []
				fileList = fileList.map(item => {
					item = `${baseUrl}${item}`
					return item
				})
				updObj = {
					fileList,
					remarks: msgCollect.desc,
				}
        this.data.imgUrls = fileList;
			}
		}
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      noticeInfo,
      userInfo,
			pageStatus: PAGE_STATUS.normal,
			formData: { user_name: userInfo.Name},
			...updObj,
    }, ()=> {
			this.uploadCom = this.selectComponent("#upload")
			this._formatImgUrls()
		})
  },
	_redirecResult(errId) {
		const { noticeId } = this.data;
		wx.redirectTo({ url: `/pkgDetail/pages/notice_result/index?errId=${errId}&noticeId=${noticeId}` });
	},
	async _getBaseNoticeById() {
		const { noticeId } = this.data
		const [err, res ] = await getBaseNoticeById(noticeId)
		if (!err && res && res.code === 200) {
			return [true, res.data]
		}
		return [false, null]
	},
	async _getMsgCollectById() {
		const { noticeId } = this.data
		const [err, res ] = await getMsgCollectById(noticeId)
		if (!err && res && res.code === 200) {
			return [true, res.data]
		}
		return [false, null]
	},
	upload_submit() {
		const { uploadLen, optType, imgUrls, baseUrl } = this.data;
		if ((optType === 'create' && uploadLen === -1 )
			|| (optType === 'update' && uploadLen === 0)) {
			wx.showToast({
				title: '请选择图片',
				icon: 'error',
				duration: 2000
			})
			return
		}
		wx.showLoading({
			title: '上传中',
			mask: true,
		})
		const uploadData  = imgUrls.find(item => item.indexOf(baseUrl) === -1);
		if (optType === 'update' && !uploadData) {
			this._updateMsgCollect()
			return
		}
		this.uploadCom.start()
	},
	bindImgSuccess(e) {
		let index = 0
		try {
			index = e.detail.index
			const resImg = e.detail.res.data
			const resData = JSON.parse(resImg)
			if (resData.code === 200 && resData.data) {
        this.data.uploadImgs.push(resData.data)
			} else {
				this._formatImgUrls()
			}
		} catch(e) {
			this._formatImgUrls()
		}
		// 上传最后一张，判断
		if (index === this.data.uploadLen - 1) {
			this.data.optType === 'create' ? this._createMsgCollect() : this._updateMsgCollect();
		}
	},
	bindError(e){
		this._formatImgUrls()
	},
	bindComplete(e) {
		const { urls } = e.detail
		this.data.imgUrls = urls;
		this.data.uploadLen = urls.length
  },
	_showError() {
		wx.hideLoading()
		setTimeout(() => {
			wx.showToast({
				title: '上传失败',
				icon: 'none',
				duration: 2000
			})
		}, 1000);
	},
	_formatImgUrls() {
		this.data.uploadImgs = [];
	},
	_getImgUrls() {
		const { uploadImgs, imgUrls, baseUrl } = this.data
    const baseUrls = imgUrls.filter(item => item.indexOf(baseUrl) != -1).map(item => {
      return item.replace(baseUrl, '');
    });
		const imgs = [...baseUrls, ...uploadImgs]
    console.log('imgs====', imgs)
		return imgs.join(';');
	},
	async _createMsgCollect() {
		const { remarks, noticeId } = this.data
		const param = {
			notice_id: noticeId,
			desc: remarks,
			img_urls: this._getImgUrls(),
		}
		const [err, res] = await createMsgCollectsg(param)
		if (!err && res && res.code === 200) {
			this._redirecResult(PAGE_STATUS.sueopt)
			return
		}
		this._showError()
	},
	async _updateMsgCollect() {
		const { remarks, msgCollect } = this.data
		const param = {
			collect_id: msgCollect.Id,
			desc: remarks,
			img_urls: this._getImgUrls(),
		}
		const [err, res] = await updateMsgCollectsg(param)
		if (!err && res && res.code === 200) {
			this._redirecResult(PAGE_STATUS.sueopt)
			return
		}
		this._showError()
	}
})