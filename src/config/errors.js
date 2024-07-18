/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-26 14:31:35
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-26 15:01:18
 * @FilePath: /MewBoss-Frontend/src/config/errors.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const errorConfigCustome = {
  // Global
  1001: '无效的数据(1001)',
  1002: '认证无法通过',

  // Account
  2001: '该邮箱地址已经被注册',
  2002: '该用户不存在',
  2003: '密码错误',
  2004: '您尚未登录',
  2005: '您还没有上传简历',
  2006: '用户名已被注册',
  2007: '未关注用户(2007)',
  2008: '您不能关注自己',
  2009: '您已经是管理员了哦',

  // Company
  3001: '您还没有管理的企业哦',
  3002: '您尚未加入企业',
  3003: '企业不存在(3003)',
  3004: '未关注企业(3004)',
  3005: '您已经在一家企业中',
  3006: '这不是您的企业',
  3007: '未被邀请(3007)',
  3008: '',
  3009: '您已是公司管理员，此通知将默认拒绝',
  3010: '该用户已在本公司中',
  3011: '您已提交申请，请勿重复提交',
  3012: '您已邀请该用户，请勿重复邀请',
  3013: '已有一条转让申请正在等待处理',

  // Requirement
  4001: '需求不存在(4001)',
  4002: '需求已满(4002)',
  4003: '不是你公司中的需求(4003)',
  4004: '你是管理员(4004)',
  4005: '您还没有上传简历，无法投递',

  // Moment
  5001: '动态不存在(5001)',
  5002: '动态已点赞(5002)',
  5003: '转发的动态不存在(5003)',

  7003: '您已提交请求，请勿重复提交'
}

const errorConfigHTTP = {
  400: '请求错误(400)',
  401: '登录信息已过期，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)'
}

export const getErrorMessageCustome = (errorNum) => {
  console.log('here')
  console.log(errorNum)
  let message = errorConfigCustome[errorNum]
  return message ? message : '未知错误(' + errorNum + ')'
}
export const getErrorMessageHTTP = (errorNo) => {
  let message = errorConfigHTTP[errorNo]
  return message ? message : '位置错误(' + errorNo + ')'
}
