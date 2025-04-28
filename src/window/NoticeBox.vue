<script setup lang="ts">
import { onMounted } from 'vue'
import WindowTitle from '../components/tools/WindowTitle.vue'
import { XBox } from '@/utils/xBox/xBox.js'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const win = window as any

// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
      timer = null
    }, delay)
  }
}

// 窗口关闭函数
const closeWindow = () => {
  win.myApi.closeWindow()
}

// 防抖处理后的窗口关闭函数
const debouncedCloseWindow = debounce(closeWindow, 2000)

onMounted(() => {
  // 主页面监听
  win.myApi.storeChangeListen((objData: object) => {
    const keys = Object.keys(objData)
    console.info(objData)
    if (keys[0] === 'noticeData') {
      const noticeData = JSON.parse(objData['noticeData'])
      XBox.popMes(noticeData.text, {
        callback: debouncedCloseWindow,
        type: noticeData.category,
        style: [1, 1],
      })
      return
    }
    for (let key of keys) {
      // 设置对应 store 的
      configStore[
        `set${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}`
      ](objData[key])
    }
  })
  // 获取 配置的索引
  win.myApi.setConfigStore({
    get: 'noticeData',
  })
})
</script>

<template>
  <div class="container"></div>
</template>

<style lang="scss" scoped>
#cover {
  width: 98%;
  height: 98%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(51, 51, 51, 0.2);
  border-radius: 15px;
  z-index: 998;
}
.container {
  
}
</style>
