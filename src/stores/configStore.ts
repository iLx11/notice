import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  let noticeData = reactive({})

  return { noticeData }
})
