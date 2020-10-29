# 去抖音水印

## 获取无水印的视频原理步骤如下：

### 1.获取视频网页版下的item_ids,dytk两个参数；
### 2.调用抖音的接口https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_ids}&dytk=${dytk}，获取视频原链接；
### 3.replace('playwm','play')获取无水印视频链接；

# 包含三种运行方式

### 1. node交互式
### 2. python交互式
### 3. 运行node服务
