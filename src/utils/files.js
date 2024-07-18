/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-27 03:08:51
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-27 03:09:39
 * @FilePath: /MewBoss-Frontend/src/utils/files.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//根据url下载文件
export const downloadUrl = (content, filename) => {
  const link = document.createElement('a')
  //_blank表示在新窗口打开链接
  link.target = '_blank'
  link.href = content
  link.setAttribute('download', filename) // 下载文件的名称及文件类型后缀
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // 下载完成移除元素
}
