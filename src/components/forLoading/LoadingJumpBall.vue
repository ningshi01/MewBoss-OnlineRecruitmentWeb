<script setup></script>

<template>
  <div class="loading-jump-container">
    <div class="wrapper">
      <div class="circle"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-jump-container {
  width: 100%;
  height: 50vh;
  border-radius: 10px;
  background-color: white;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
}
.wrapper {
  left: calc(50% - 10px);
  height: 90%;
  position: relative;
}
.circle {
  width: 20px;
  height: 20px;
  position: absolute;
  background-color: #0571c9;
  border-radius: 50%;
  animation: ball 0.5s alternate infinite ease;
}
@keyframes ball {
  0% {
    top: 55%;
    height: 5px;
    border-radius: 50px 50px 45px 45px;
    transform: scaleX(1.3);
  }
  100% {
    top: 30%;
  }
}
</style>
