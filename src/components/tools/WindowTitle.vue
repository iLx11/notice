<script setup lang="ts">
import WindowTools from './WindowTools.vue'

const win = window as any

</script>

<template>
  <div class="top-title">
    <div id="window-sign"></div>
    <slot name="title"> Notice </slot>
    <WindowTools />
  </div>
</template>

<style lang="scss" scoped>
#window-sign {
  width: 3px;
  height: 80%;
  border-radius: 6px;
  background: rgba(51, 51, 51, 0.4);
  margin-right: 10px;
  margin-left: 1px;
}
.top-title {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: flex-start;
  justify-items: center;
  padding: 6px;
  z-index: 4;
  font-size: 20px;
  // margin-bottom: 0.3em;
  -webkit-app-region: drag;
  // color: rgba(255, 255, 255, 0.9);
}

</style>