import {postCheckLogin, getLoginCode, postLogin} from '../servers/login'
import { setStorage } from '../../utils/util';
const app = getApp()
Page({
  data: {
  },
	onLoad() {
		this.checkLoin()
  },
	async checkLoin() {
		const [err, res] = await postCheckLogin();
		if (!err && res && res.code === 401) {
			const code = await getLoginCode();
			code && await this.handLogin(code);
		}
	},
	async handLogin(code) {
		const [err, res] = await postLogin(code);
		if (!err && res && res.code === 200) {
			setStorage('minikey', res.token)
		}
	}
})
