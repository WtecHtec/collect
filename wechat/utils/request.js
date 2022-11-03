import { mode, BASE_URL } from "../config";
import { getStorage } from "./util";
const Request = (url, data) => {
	const minikey = getStorage('minikey') || '';
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL[mode]}${url}`,
      data,
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${minikey}`
      },
			method: 'POST',
      success (res) {
				if (res && res.data) {
					return resolve(['', res.data]);
				}
			  resolve([`post ${url} response error `, null]);
      },
			fail() {
				resolve([`post ${url} error`, null]);
			}
    })
  })
}
export default Request