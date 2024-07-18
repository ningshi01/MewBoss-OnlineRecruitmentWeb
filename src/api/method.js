/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-24 15:21:08
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-25 14:59:04
 * @FilePath: /MewBoss-Frontend/src/api/method.js
 * @Description: 二次封装的axios，可以更灵活配置CRUD方式和参数
 */
import request from '@/utils/request'
import { changes } from '@/utils/obj2url'
/**
 * 通用请求方法
 * @param {methodType} 请求方式
 * @param {urlName} 接口名称
 * @param {dataParams} 正常传参
 * @param {urlParam} url参数restFul风格
 */
/* 通用请求方法 */
export function ajaxRequest(methodType, url, dataParams, urlParam) {
  methodType = methodType.toUpperCase()
  dataParams = dataParams || ''
  urlParam = urlParam || ''
  let requestConfig = {
    method: methodType
  }
  requestConfig.url = urlParam ? url + '?' + changes(urlParam) : url
  switch (methodType) {
    case 'POST':
    case 'PUT':
    case 'DELETE':
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.data = dataParams
      break
    case 'GET':
      requestConfig.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      requestConfig.params = dataParams
      break
    case 'UPLOAD':
      requestConfig.headers = { 'Content-Type': 'application/form-data' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
    case 'MULTIUPLOAD':
      requestConfig.headers = { 'Content-Type': 'multipart/form-data' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
    // 下载excel zip
    case 'DOWNLOAD':
      requestConfig.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      requestConfig.method = 'GET'
      requestConfig.params = dataParams
      requestConfig.responseType = 'blob'
      break
    // 下载回显图片
    case 'GETIMAGE':
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.method = 'GET'
      requestConfig.params = dataParams
      requestConfig.responseType = 'blob'
      break
    default:
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
  }
  return request(requestConfig)
}
