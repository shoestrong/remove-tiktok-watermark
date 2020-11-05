const fs = require('fs')
const path = require('path')
const axios = require('axios')
const router = require('koa-router')()
const { ipAddress } = require('../utils/config')

const UA = ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'


const getUrlItemIds = (requestUrl) => {
	return new Promise((resolve, reject) => {
		axios.get(requestUrl, {
			headers: {
				'user-agent': UA
			}
		}).then(response => {
			const [, item_ids] = /video\/(\d+)\//.exec(response.request.path)
			resolve({
				item_ids
			})
		}).catch(reject)
	})
}

// 通过抖音API获取没有水印的链接
const getDYVideoUrl = ({ item_ids }) => {
	return new Promise((resolve, reject) => {
		axios.get(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_ids}`, {
			headers: {
				'user-agent': UA
			}
		}).then((response) => {
			let { status_code, item_list } = response.data
			if (status_code === 0) {
				const filename = item_list[0].desc + '.mp4';
				let url = item_list[0].video.play_addr.url_list[0].replace(
					'playwm',
					'play'
				)
				resolve({ url, filename })
			} else {
				reject(status_code)
			}
		}).catch(reject)
	})
}

// 下载文件到本地
const downloadFile = async (url, filepath, name) => {
	if (!fs.existsSync(filepath)) {
		fs.mkdirSync(filepath)
	}
	const mypath = path.resolve(filepath, name)
	const writer = fs.createWriteStream(mypath)
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	})
	response.data.pipe(writer)
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
		resolve()
	})
}

// 存在本地的改成能请求的链接
const buildVideoFilesToUrl = (url) => {
	return new Promise((resolve, reject) => {
		getUrlItemIds(url).then(data => {
			getDYVideoUrl(data).then(file => {
				// let fileName = `${dayjs().unix()}.mp4`
				// let fileName = `${file.filename}`
				let fileName = `myvedio.mp4`
				downloadFile(
					file.url,
					path.join(__dirname, '../download'),
					fileName
				).then(() => {
					resolve(`${ipAddress}/download/${fileName}`)
				}).catch(() => {
					reject('下载出错')
				})
			}).catch(() => {
				reject('获取无水印链接出错')
			})
		}).catch(() => {
			reject('爬虫页面出错')
		})
	})
}

// 添加前缀请求url
router.prefix('/oapi')

// 请求地址为/douyin/getCurrentUrl
router.get('/douyin/getCurrentUrl', async (ctx, next) => {
	let { url } = ctx.query
	await buildVideoFilesToUrl(url).then(cuurentUrl => {
		ctx.body = {
			status: true,
			result: {
				url: cuurentUrl
			},
			msg: '转换成功'
		}
	}).catch((err) => {
		ctx.body = {
			status: false,
			result: {
				msg: err
			},
			msg: '转换失败'
		}
	})
})

module.exports = router