<script setup></script>

<template>
  <div class="blank-container">
    <div class="img-container">
      <img src="../../assets/cat2.svg" alt="" />
    </div>
    <div class="text1">未找到相关结果</div>
    <div class="text2">请尝试缩短或改写搜索关键词。</div>
  </div>
</template>

<style scoped>
.blank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10%;
}
.img-container {
  width: 60%;
}
.text1 {
  font-size: 20px;
  font-weight: 900;
}
.text2 {
  font-size: 18px;
  color: #cccccc;
}
</style>
