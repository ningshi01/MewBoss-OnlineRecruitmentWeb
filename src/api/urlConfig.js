/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-24 15:05:49
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-30 10:13:53
 * @FilePath: /MewBoss-Frontend/src/api/urlConfig.js
 * @Description: 所有接口的url地址汇总
 */
const urlConst = {
  //account账户
  userSignIn: '/account/register',
  userLogin: '/account/login',
  userLogout: '/account/logout',
  userProfileUpdate: '/account/userprofile',
  userResumeUpdate: '/account/resume',
  userInfoGet: '/account/get_info',
  userCurrentInfoGet: '/account/current_user',
  userResumeDownload: '/account/resume/download',
  userLogoff: '/account/logoff',
  userSubscribe: '/account/subscribe_user',
  userUnsubscribe: '/account/unsubscribe_user',
  userAvatarUpload: '/account/avatar',
  resumeAutoEnhance: '/enhance_resume',
  userInfoUpdate: '/account/userprofile',
  userIdGet: '/account/current_user',
  userResumePreview: '/account/preview',
  userFollowGet: '/account/subscribed_user/list',
  companyFollowGet: '/account/subscribed_company/list',
  userFansGet: '/account/get_my_fans',
  userApplyGet: '/account/get_my_job_apply',
  userTimesReduce: '/account/reduce_token',
  //company
  companyCreate: '/company/create',
  companyInfoGet: '/company/get',
  companyRequirementsPublish: '/company/add_requirements',
  companyInfoUpdate: '/company/update',
  companyRequirementsDelete: '/company/delete_requirements',
  userResumePost: '/company/post_resume',
  userResign: '/company/leave_company',
  managerHandleResign: '/company/confirm_leave',
  companySubscribe: '/company/subscribe_company',
  companyUnsubscribe: '/company/unsubscribe_company',
  companyEmployeeAdd: '/company/add_employee',
  companyEmployeeDelete: '/company/delete_employee',
  userJoinCompany: '/company/join_company',
  companyQuitNoticeGet: '/company/get_quit_notice',
  companyFeatureUpdate: '/company/update_feature',
  companyManagerChange: '/company/change_company_manager',
  companyManagerChangeConfirm: '/company/confirm_change_manager',
  companyEmployeeListGet: '/company/get_employee_list',
  //新添加的接口！
  getRestTimes: '/account/get_LLM_tokens',
  userGetOneRequirement: '/company/requirement/single',
  adminGetApplyList: '/company/apply/list',
  adminApplyDeal: '/company/apply/process',
  userGetRequirementList: '/company/requirement/list',
  adminGetBeAcceptList: '/company/requirement/user/list',
  //moment动态
  momentCreate: '/moment/create',
  momentDelete: '/moment/delete',
  momentLike: '/moment/like',
  momentComment: '/moment/comment',
  userMomentGet: '/moment/user',
  companyMomentGet: '/moment/company_moment',
  momentListGet: '/moment/list',
  momentGetById: '/moment/get_moment_by_id',
  //chat聊天
  chatCreate: '/chat/room',
  chatRoomGet: '/chat/room/list',
  chatHistoryGet: '/chat/history',
  chatDelete: '/chat/room/delete',
  //notice通知
  noticeGet: '/notice/get_notice',
  companyNoticeGet: '/notice/get_notice/company',
  noticeDeleteAll: '/account/delete_already_idle_notice',
  //recommend推荐
  jobRequirementRecommend: '/recommend/recommend_job_requirement',
  userRecommend: '/recommend/recommend_user',
  companyRecommend: '/recommend/recommend_company',
  comprehensiveSearch: '/recommend/advanced_search',
  //接口测试
  test: '/account/test_get'
}

export default urlConst
