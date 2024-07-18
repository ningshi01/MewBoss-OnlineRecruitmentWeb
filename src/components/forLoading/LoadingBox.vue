<script setup></script>

<template>
  <div class="loading-box-container">
    <div class="loading-text">加载中</div>
    <div class="box">
      <div class="loading"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-box-container {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-text {
  color: #0571c9;
  font-size: 16px;
  font-weight: 600;
}
.box {
  width: 40%;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  position: relative;
}
.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #0571c9;
  border-radius: 5px;
  animation: move-ani 2s linear infinite;
}

@keyframes move-ani {
  50% {
    width: 100%;
  }
  100% {
    width: 0;
    left: unset;
    right: 0;
  }
}
</style>
