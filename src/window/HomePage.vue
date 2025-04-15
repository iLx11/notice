<script setup lang="ts">
import WindowTools from '../components/tools/WindowTools.vue'
import WindowTitle from '../components/tools/WindowTitle.vue'
import checkBoxConfig from '../components/config/checkBoxConfig.vue'
import { onMounted, nextTick, ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { XBox } from '@/utils/xBox/xBox.js'

const router = useRouter()
const win = window as any

onMounted(async () => {
  // createWindow()
  // 30 分钟的毫秒数
  // const intervalTime = 30 * 60 * 1000
  // // 设置定时器，每隔 30 分钟执行一次 myFunction
  // setInterval(createWindow, intervalTime)
  
  XBox.popMes('每隔 30 分钟执行一次', {
    // 宽度
    width: '400px',
    // 弹出类型
    type: 'err',
    // 持续时间
    dur: 2000,
    // 结束回调函数
    callback: null,
    // 样式，数组元素置为 1 为不同样式
    style: [1, 1],
  })
})

const createWindow = async () => {
  const { width, height } = await win.myApi.getScreenSize()
  // console.log(router)
  // console.log(router.currentRoute.value.path)
  win.myApi.createNewWindow(
    {
      route: '/child',
    },
    {
      width: 600,
      height: 150,
      alwaysOnTop: true,
      x: width - 300 * 1.6,
      y: 0,
    }
  )
}
</script>

<template>
  <div
    class="container"
    @click=""
  >
    <WindowTitle>
      <div>HomePage</div>
    </WindowTitle>
  </div>
</template>

<style lang="scss">
#cover {
  @include global.full_wh;
  @include global.ab_center;
  @include global.style_common(15px, rgba(51, 51, 51, 0.2));
}

.container {
  @include global.wh(99.6%, 99.6%);
  @include global.ab_center;
  @include global.style_common(
    25px,
    var(--content-box-color),
    1.5px solid rgba(173, 171, 171, 0.4)
  );
  box-sizing: border-box;
  padding: 10px;
  z-index: 2;
  color: var(--text-color-1);
  overflow: hidden;
  // -webkit-app-region: drag;
}
</style>
