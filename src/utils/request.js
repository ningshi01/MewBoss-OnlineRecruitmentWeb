/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-24 15:05:43
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-26 15:02:12
 * @FilePath: /MewBoss-Frontend/src/utils/request.js
 * @Description: axios基本配置和拦截器配置
 */

import axios from 'axios'
import qs from 'qs'
import { getToken } from '@/utils/token'
import { getErrorMessageCustome, getErrorMessageHTTP } from '@/config/errors'
const BASE_URL = '/api'
const TIMEOUT_MILLISECONDS = 10000 // 超时链接

const instance = axios.create({
  withCredentials: false,
  baseURL: BASE_URL, // 基本url
  timeout: TIMEOUT_MILLISECONDS,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

instance.interceptors.request.use(
  (config) => {
    // 每个接口新增时间戳
    let timestamp = new Date().getTime()
    if (config.url && config.url.includes('?')) {
      config.url = `${config.url}&t=${timestamp}`
    } else {
      config.url = `${config.url}?t=${timestamp}`
    }
    // PUT POST DELETE方式提交的数据格式化
    if (
      (config.method === 'post' || config.method === 'put' || config.method === 'delete') &&
      config.headers['Content-Type'] !== 'application/json' &&
      config.headers['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = qs.stringify(config.data)
    }
    // 在发送请求之前 判断是否存在token，如果存在的话，则每个http header都加上token
    if (getToken('csrftoken')) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers['X-Csrftoken'] = getToken('csrftoken')
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    // 下载类型特殊处理文件名
    const type = response.request.responseType || ''
    if (type.includes('blob')) {
      let disposition = response.headers['content-disposition']
      let filename = '默认文件名'
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = decodeURI(
          disposition.substring(disposition.indexOf('filename=') + 9, disposition.length)
        )
      }
      response.data.filename = filename
    }
    if (response.data.errno != 0) {
      window.$message.warning(getErrorMessageCustome(response.data.errno))
    }
    return response.data
  },
  (error) => {
    if (error.response.status && error.response) {
      window.$message.error(getErrorMessageHTTP(error.response.status))
    }
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      window.$message.error('connection time out')
    }
    return Promise.reject(error)
  }
)
export default instance
