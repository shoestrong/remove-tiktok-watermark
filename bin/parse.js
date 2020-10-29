const fs = require('fs');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
const inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input',
    message: '请输入你要去水印的链接：',
    name: 'url',
    default: 'https://v.douyin.com/Jajqoxv/'
  }
]).then(answer => {
  parseDouyinUrl(answer.url)
});

/**
 * 解析抖音链接，并去除水印
 * @param {string} url 解析地址
 */
function parseDouyinUrl(url) {
  fetch(url).then(res => {
    const [, item_ids] = /video\/(\d+)\//.exec(res.url)
    fetch(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_ids}`).then(res => res.text()).then(res => {
      const resUrl = JSON.parse(res).item_list[0].video.play_addr.url_list[0].replace('playwm', 'play')
      const filename = JSON.parse(res).item_list[0].desc + '.mp4';
      downloadParseUrl(resUrl, filename, () => {
        console.log('文件位置：download/'+filename + '.mp4\n下载完毕')
      })
    }).catch(err => {
      console.log(`输入内容“${url}”解析失败：`, err);
    })
  }).catch(err => {
    console.log(`输入内容“${url}”解析失败：`, err);
  })
}

/**
 * 下载链接生成的视频
 *
 * @param {string} url 下载地址
 * @param {string} filename  下载到本地的名字
 * @param {function} callback  回调
 */
function downloadParseUrl(url, filename, callback) {
  var stream = fs.createWriteStream( path.join(__dirname, '../download/' + filename));
  request(url).pipe(stream).on('close', callback);
}