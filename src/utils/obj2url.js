/*
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-25 12:55:00
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-25 13:41:33
 * @FilePath: /MewBoss-Frontend/src/utils/obj2url.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function changes(obj) {
  var arr = []
  for (var p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      arr.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return arr.join('&')
}
