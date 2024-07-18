<!--
 * @Author: Chen Bolin 21373066@buaa.edu.cn
 * @Date: 2024-06-22 20:49:56
 * @LastEditors: Chen Bolin 21373066@buaa.edu.cn
 * @LastEditTime: 2024-06-28 11:44:27
 * @FilePath: /MewBoss-Frontend/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/forNavBar/NavHead.vue'
import TheMessage from './components/forNavBar/TheMessage.vue'
import TheLoadingBar from './components/forNavBar/TheLoadingBar.vue'
</script>

<template>
  <div id="container">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <navBar v-if="!$route.meta.closeNav" class="Bar" />
          <RouterView />
          <TheMessage />
          <TheLoadingBar />
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>

<style scoped>
#container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: #f4f2ee;
  overflow-y: auto;
}
.Bar {
  z-index: 100;
  position: fixed;
  top: 0px;
  width: 100%;
}
</style>
