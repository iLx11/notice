<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import WindowTitle from '../components/tools/WindowTitle.vue'
import { XBox } from '@/utils/xBox/xBox.js'
import dayjs from 'dayjs'

const win = window as any
onMounted(() => {
  // XBox.popMes('请调整坐姿', {
  //   callback: () => {
  //     win.myApi.closeWindow()
  //   },
  // })
})
// 提醒数据结构
let id = 0
const reminders = reactive([])

// 新提醒表单数据
const newReminder = reactive({
  text: '',
  type: 'interval',
  category: 'info',
})

const intervalConfig = reactive({
  value: 5,
  unit: 'minute',
})

const dailyTime = ref('09:00')

// 计算每日时间配置
const dailyConfig = computed(() => {
  const [hour, minute] = dailyTime.value.split(':')
  return { hour: parseInt(hour), minute: parseInt(minute) }
})

/********************************************************************************
 * @brief: 添加提醒
 * @return {*}
 ********************************************************************************/
function addReminder() {
  const reminder = {
    id: id++,
    text: newReminder.text,
    type: newReminder.type,
    timeConfig:
      newReminder.type === 'interval'
        ? { ...intervalConfig }
        : { ...dailyConfig.value },
    nextTrigger: null,
    timerId: null,
  }

  scheduleReminder(reminder)
  reminders.push(reminder)

  // 重置表单
  newReminder.text = ''
}

/********************************************************************************
 * @brief: 安排提醒
 * @param {*} reminder
 * @return {*}
 ********************************************************************************/
const scheduleReminder = (reminder) => {
  const now = Date.now()
  const triggerTime = reminder.nextTrigger.getTime()
  const delay = triggerTime - now

  if (delay < 0) return

  reminder.timerId = setTimeout(() => {
    triggerReminder(reminder)
    scheduleReminder(reminder)
  }, delay)
}

/********************************************************************************
 * @brief: 触发提醒
 * @param {*} reminder
 * @return {*}
 ********************************************************************************/
const triggerReminder = (reminder) => {
  // 使用浏览器通知
  if (Notification.permission === 'granted') {
    new Notification('提醒', {
      body: reminder.text,
    })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission()
  }

  console.log(`提醒触发：${reminder.text}`)
}

/********************************************************************************
 * @brief: 删除提醒
 * @param {*} id
 * @return {*}
 ********************************************************************************/
const removeReminder = (id) => {
  const index = reminders.findIndex(r => r.id === id)
  if (index > -1) {
    // 双重保障清除定时器
    clearTimeout(reminders[index].timerId)
    reminders[index].timerId = null
    reminders.splice(index, 1)
  }
}

// 格式化日期显示
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 组件卸载时清除所有定时器
onUnmounted(() => {
  reminders.forEach(reminder => {
    clearTimeout(reminder.timerId)
  })
})
</script>

<template>
  <div id="notice-list-content">
    <div class="reminder-app">
      <h1>提醒列表</h1>

      <!-- 添加提醒表单 -->
      <div class="add-reminder">
        <input
          v-model="newReminder.text"
          placeholder="提醒内容"
        />

        <select v-model="newReminder.type">
          <option value="interval">间隔提醒</option>
          <option value="daily">每日定时</option>
        </select>

        <div v-if="newReminder.type === 'interval'">
          <input
            type="number"
            v-model.number="intervalConfig.value"
            min="1"
          />
          <select v-model="intervalConfig.unit">
            <option value="minute">分钟</option>
            <option value="hour">小时</option>
          </select>
        </div>

        <div v-else>
          <input
            type="time"
            v-model="dailyTime"
            required
          />
        </div>

        <button @click="addReminder">添加提醒</button>
      </div>

      <!-- 提醒列表 -->
      <div class="reminder-list">
        <div
          v-for="reminder in reminders"
          :key="reminder.id"
          class="reminder-item"
        >
          <div class="content">
            <h3>{{ reminder.text }}</h3>
            <p>
              类型: {{ reminder.type === 'interval' ? '间隔提醒' : '每日定时' }}
            </p>
            <p>下次触发: {{ formatDate(reminder.nextTrigger) }}</p>
          </div>
          <button @click="removeReminder(reminder.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
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
#notice-list-content {
  @include global.full_wh;
  // background: blue;
  .reminder-app {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
  }

  .add-reminder {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reminder-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reminder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}
</style>
