#encoding=utf-8
import requests, re, json
url = input("请输入你要去水印的链接：(eg: https://v.douyin.com/Jajqoxv/)\n")
url = url if url!='' else 'https://v.douyin.com/Jajqoxv/'
print('获取item_ids中...')
est1 = requests.get(url)
uq = re.findall('video/(\d+)/',str(est1.url))[0]
ur11 = f'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={uq}'
print('获取url中...')
est2 = requests.get(ur11).text
js1 = json.loads(est2)
url3 = str(js1['item_list'][0]['video']['play_addr']['url_list'][0]).replace('playwm','play')
title = str(js1['item_list'][0]['desc'])
headers = {'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3329.0 Mobile Safari/537.36'}
print('下载中...')
est = requests.get(url=url3,headers=headers)
with open(f'download/{title}.mp4','wb') as f:
    f.write(est.content)
    print('文件位置：download/'+title + '.mp4\n下载完毕')
