<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import '@/utils/xBox/style/xBox.css'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@font-face {
  font-family: 'ceyy';
  src: url('./assets/font/ceyy.ttf');
}

:root {
  --content-box-color: rgb(233, 233, 233);
  --pop-box-color: rgba(255, 255, 255, 0.95);
  --text-color-1: rgba(51, 51, 51, 0.85);
  --text-color-2: rgba(51, 51, 51, 0.5);
  --span-text-color: rgb(143, 206, 202);
}

[main-theme='color'] {
  --content-box-color: rgb(255, 255, 255);
  --pop-box-color: rgba(255, 255, 255, 0.95);
  --text-color-1: rgba(51, 51, 51, 0.85);
  --text-color-2: rgba(51, 51, 51, 0.5);
  --span-text-color: rgb(143, 206, 202);
}

@include global.app_common;

*::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
* {
  margin: 0;
  padding: 0;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
html,
body,
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'ceyy';
  background: rgba(0, 0, 0, 0);
}
li {
  list-style: none;
}
</style>
