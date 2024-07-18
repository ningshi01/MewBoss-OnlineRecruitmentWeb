/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-24 18:24:34
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-26 11:03:52
 * @FilePath: /MewBoss-Frontend/src/utils/token.js
 * @Description: 用于csrftoken和sessionid的存取
 */
import Cookies from 'js-cookie'

const token_key = 'csrftoken'
const userID_key = 'id'

export function getToken(key) {
  return Cookies.get(key) //获取键名为Admin-Token的值
}

export function setToken(key, value) {
  return Cookies.set(key, value) //设置键名Admin-Token，值为token
}

export function removeToken(key) {
  return Cookies.remove(key) //移除键名为Admin-Token的值
}
//检查登陆状态
export function checkLogin() {
  return getToken(token_key) != null && getToken(userID_key) //移除键名为Admin-Token的值
}
