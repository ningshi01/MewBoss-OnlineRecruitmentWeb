/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-24 16:10:39
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-30 10:14:53
 * @FilePath: /MewBoss-Frontend/src/api/apiList.js
 * @Description: 封装好的用户接口列表，具体参数值请参考ApiFox文档
 */
import urlConst from '@/api/urlConfig'
import { ajaxRequest } from '@/api/method'
import { removeToken } from '@/utils/token'

//#region account用户

//用户注册
export const userSignIn = (params) => {
  return ajaxRequest('post', urlConst.userSignIn, params, '')
}
//用户登录
export const userLogin = (params) => {
  return ajaxRequest('post', urlConst.userLogin, params, '')
}
//用户登出
export const userLogout = () => {
  removeToken('csrftoken')
  removeToken('sessionid')
  removeToken('id')
  return ajaxRequest('get', urlConst.userLogout, '', '')
}
//用户补充/修改账户信息
export const userInfoUpdate = (params) => {
  return ajaxRequest('post', urlConst.userInfoUpdate, params, '')
}
//上传/更新简历
export const userResumeUpdate = (params) => {
  return ajaxRequest('multiupload', urlConst.userResumeUpdate, params, '')
}
//获取用户信息
export const userInfoGet = (params) => {
  return ajaxRequest('post', urlConst.userInfoGet, params, '')
}
//获取美化简历剩余次数
export const getRestTimes = () => {
  return ajaxRequest('get', urlConst.getRestTimes, '', '')
}
//用户剩余次数-1
export const userTimesReduce = () => {
  return ajaxRequest('get', urlConst.userTimesReduce, '', '')
}
//获取当前用户信息
export const userCurrentInfoGet = () => {
  return ajaxRequest('get', urlConst.userCurrentInfoGet, '', '')
}
//通过id下载某一用户的简历
export const userResumeDownload = (params) => {
  return ajaxRequest('get', urlConst.userResumeDownload, '', params)
}
//用户注销
export const userDelete = () => {
  return ajaxRequest('delete', urlConst.userLogoff, '', '')
}
//关注用户
export const userSubscribe = (params) => {
  return ajaxRequest('post', urlConst.userSubscribe, params, '')
}
//取消关注用户
export const userUnsubscribe = (params) => {
  return ajaxRequest('post', urlConst.userUnsubscribe, params, '')
}
//上传用户头像
export const userAvatarUpload = (params) => {
  return ajaxRequest('multiupload', urlConst.userAvatarUpload, params, '')
}
//获取关注用户列表
export const userFollowGet = () => {
  return ajaxRequest('get', urlConst.userFollowGet, '', '')
}
//获取关注企业列表
export const companyFollowGet = () => {
  return ajaxRequest('get', urlConst.companyFollowGet, '', '')
}
//获取投递过的岗位
export const userApplyGet = () => {
  return ajaxRequest('get', urlConst.userApplyGet, '', '')
}
//优化简历
export const userResumeEnhance = () => {
  return ajaxRequest('get', urlConst.resumeAutoEnhance, '', '')
}
//获取用户Id
export const userIdGet = () => {
  return ajaxRequest('get', urlConst.userIdGet, '', '')
}
//获取用户粉丝列表
export const userFansGet = () => {
  return ajaxRequest('get', urlConst.userFansGet, '', '')
}
//#endregion
//#region company企业
//添加企业
export const companyCreate = (params) => {
  return ajaxRequest('multiUpload', urlConst.companyCreate, params, '')
}
//查看企业详情
export const companyInfoGet = (params) => {
  return ajaxRequest('get', urlConst.companyInfoGet, '', params)
}
//发布招聘信息
export const companyRequirementsPublish = (params) => {
  return ajaxRequest('post', urlConst.companyRequirementsPublish, params, '')
}
//修改企业信息
export const companyInfoUpdate = (params) => {
  return ajaxRequest('multiupload', urlConst.companyInfoUpdate, params, '')
}
//删除招聘信息
export const companyRequirementsDelete = (params) => {
  return ajaxRequest('post', urlConst.companyRequirementsDelete, params, '')
}
export const companyManagerChange = (params) => {
  return ajaxRequest('post', urlConst.companyManagerChange, params, '')
}
export const companyManagerChangeConfirm = (params) => {
  return ajaxRequest('post', urlConst.companyManagerChangeConfirm, params, '')
}
/////////////////////////////////////////////////////////////////////////////////////////
//管理员获取招聘申请工单列表
export const adminGetApplyList = (params) => {
  return ajaxRequest('get', urlConst.adminGetApplyList, '', params)
}
//企业管理员处理申请
export const adminApplyDeal = (params) => {
  return ajaxRequest('post', urlConst.adminApplyDeal, params, '')
}
//通过公司id获取招聘岗位列表
export const userGetRequirementList = (params) => {
  return ajaxRequest('get', urlConst.userGetRequirementList, '', params)
}
//获取单个岗位信息
export const userGetOneRequirement = (params) => {
  return ajaxRequest('get', urlConst.userGetOneRequirement, '', params)
}
//通过岗位id获取岗位已录用人员列表
export const adminGetBeAcceptList = (params) => {
  return ajaxRequest('get', urlConst.adminGetApplyList, '', params)
}
/////////////////////////////////////////////////////////////////////////////////////////
//用户投递简历
export const userResumePost = (params) => {
  return ajaxRequest('post', urlConst.userResumePost, params, '')
}
//退出企业
export const userResign = () => {
  return ajaxRequest('post', urlConst.userResign, '', '')
}
//管理员处理离职信息
export const managerHandleResign = (params) => {
  return ajaxRequest('post', urlConst.managerHandleResign, params, '')
}
//关注企业
export const companySubscribe = (params) => {
  return ajaxRequest('post', urlConst.companySubscribe, params, '')
}
//取消关注企业
export const companyUnsubscribe = (params) => {
  return ajaxRequest('post', urlConst.companyUnsubscribe, params, '')
}
//管理员添加员工
export const companyEmployeeAdd = (params) => {
  return ajaxRequest('post', urlConst.companyEmployeeAdd, params, '')
}
//管理员删除员工
export const companyEmployeeDelete = (params) => {
  return ajaxRequest('post', urlConst.companyEmployeeDelete, params, '')
}
//用户认证加入企业
export const userJoinCompany = (params) => {
  return ajaxRequest('post', urlConst.userJoinCompany, params, '')
}
//管理员查看用户退出信息
export const companyQuitNoticeGet = () => {
  return ajaxRequest('post', urlConst.companyQuitNoticeGet, '', '')
}
//更新企业标签
export const companyFeatureUpdate = (params) => {
  return ajaxRequest('post', urlConst.companyFeatureUpdate, params, '')
}
//管理员查看企业员工列表
export const companyEmployeeListGet = (params) => {
  return ajaxRequest('get', urlConst.companyEmployeeListGet, params, '')
}
//管理员发送转移管理员权限请求
//#endregion
//#region moment动态
//创建动态
export const momentCreate = (params) => {
  return ajaxRequest('multiupload', urlConst.momentCreate, params, '')
}
//删除动态
export const momentDelete = (params) => {
  return ajaxRequest('delete', urlConst.momentDelete, params, '')
}
//点赞动态
export const momentLike = (params) => {
  return ajaxRequest('post', urlConst.momentLike, params, '')
}
//评论动态
export const momentComment = (params) => {
  return ajaxRequest('post', urlConst.momentComment, params, '')
}
//获取用户动态列表
export const userMomentGet = (params) => {
  return ajaxRequest('get', urlConst.userMomentGet, '', params)
}
export const momentGetById = (params) => {
  return ajaxRequest('post', urlConst.momentGetById, params, '')
}
//预览简历
export const userResumePreview = (params) => {
  return ajaxRequest('multiupload', urlConst.userResumePreview, params, '')
}
//获取企业动态列表
export const companyMomentGet = (params) => {
  return ajaxRequest('get', urlConst.companyMomentGet, '', params)
}
//获取关注的用户/企业动态列表/随机推荐
export const momentListGet = () => {
  return ajaxRequest('get', urlConst.momentListGet, '', '')
}
//#endregion
//#region chat聊天
//创建聊天
export const chatCreate = (params) => {
  return ajaxRequest('post', urlConst.chatCreate, params, '')
}
//获取聊天室列表
export const chatRoomGet = async () => {
  return ajaxRequest('get', urlConst.chatRoomGet, '', '')
}
//获取聊天记录
export const chatHistoryGet = async (params) => {
  return ajaxRequest('get', urlConst.chatHistoryGet, '', params)
}
export const chatDelete = (params) => {
  return ajaxRequest('delete', urlConst.chatDelete, params, '')
}
//个人notice通知
export const noticeGet = () => {
  return ajaxRequest('get', urlConst.noticeGet, '', '')
} //企业notice通知
export const companyNoticeGet = () => {
  return ajaxRequest('get', urlConst.companyNoticeGet, '', '')
}
export const noticeDeleteAll = () => {
  return ajaxRequest('get', urlConst.noticeDeleteAll, '', '')
}
//recommend推荐
//推荐岗位信息
export const jobRequirementRecommend = () => {
  return ajaxRequest('get', urlConst.jobRequirementRecommend, '', '')
}
//推荐用户
export const userRecommend = () => {
  return ajaxRequest('get', urlConst.userRecommend, '', '')
}
//推荐企业
export const companyRecommend = () => {
  return ajaxRequest('get', urlConst.companyRecommend, '', '')
}
//综合搜索
export const comprehensiveSearch = (params) => {
  return ajaxRequest('get', urlConst.comprehensiveSearch, params, '')
}
//test测试
export const test = () => {
  return ajaxRequest('get', urlConst.test, '', '')
}
//#endregion
