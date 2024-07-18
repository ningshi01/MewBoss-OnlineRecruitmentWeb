<script setup>
function linkTo(type) {
  switch (type) {
    case 1:
      window.open('https://beian.miit.gov.cn/#/Integrated/index', '_blank')
      break
  }
}
</script>

<template>
  <div class="linkContainer">
    <div class="links">
      <div class="link" @click="linkTo(1)">京ICP备 2024059703号</div>
    </div>
    <div class="item">MewBoss Corporation © 2024年</div>
  </div>
</template>

<style scoped>
.linkContainer {
  position: fixed;
  right: 10vw;
  top: 10vh;
  width: 20vw;
  height: 30%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: small;
  color: grey;
}
.links {
  display: flex;
  justify-content: center;
  align-items: center;
}
.link {
  margin: 10px;
  cursor: pointer;
  border-bottom: 1px solid transparent;
}
.link:hover {
  color: darkgreen;
  border-bottom: 1px solid darkgreen;
}
</style>
