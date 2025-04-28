<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import WindowTitle from '../components/tools/WindowTitle.vue'
import { XBox } from '@/utils/xBox/xBox.js'
import SelectDropTool from '@/utils/xComp/select/SelectDropTool.vue'

const win = window as any
onMounted(() => {
  // XBox.popMes('请调整坐姿', {
  //   callback: () => {
  //     win.myApi.closeWindow()
  //   },
  // })
  createWindow()
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

const selectDropData = reactive([
  {
    // 数值
    list: [
      {
        item: 'info',
        value: true,
      },
      {
        item: 'warn',
        value: false,
      },
      {
        item: 'err',
        value: false,
      },
    ],
    // 配置名
    text: '提醒类型',
    // 配置描述
    desc: '配置不同的提醒类型，会有不同的颜色提示',
  },
  {
    // 数值
    list: [
      {
        item: '分钟',
        value: true,
      },
      {
        item: '小时',
        value: false,
      },
    ],
    // 配置名
    text: '时间配置',
    // 配置描述
    desc: '可以配置分钟或是小时',
  },
])

const selectPattern = reactive({
  // text 与 desc 底部间距
  textMargin: '25px',
  // 配置组件与其他组件底部间距
  boxMargin: '0px',
  selectFontSize: '20px',
  textFontSize: '22px',
  descFontSize: '18px',
})

/********************************************************************************
 * @brief: 添加提醒
 * @return {*}
 ********************************************************************************/
function addReminder() {
  if (!newReminder.text.trim()) {
    XBox.popMes('请输入提醒内容', { type: 'err', style: [1, 1] })
    return
  }
  const reminder = {
    id: id++,
    text: newReminder.text,
    type: newReminder.type,
    category: newReminder.category,
    timeConfig:
      newReminder.type === 'interval'
        ? { ...intervalConfig }
        : { ...dailyConfig.value },
    timerId: null,
    timer: 0,
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
const scheduleReminder = reminder => {
  if (!reminder) return
  const delayTime = Math.floor(
    reminder.type === 'interval' && reminder.timeConfig.unit === 'minute'
      ? reminder.timeConfig.value * 60 * 1000
      : reminder.timeConfig.value * 60 * 60 * 1000
  )
  reminder.timerId = setInterval(() => {
    triggerReminder(reminder)
    // scheduleReminder(reminder)
  }, delayTime)
  console.info(reminders)
}

/********************************************************************************
 * @brief: 触发提醒
 * @param {*} reminder
 * @return {*}
 ********************************************************************************/
const triggerReminder = reminder => {
  // 使用浏览器通知
  // if (Notification.permission === 'granted') {
  //   new Notification('提醒', options)
  // } else if (Notification.permission !== 'denied') {
  //   Notification.requestPermission()
  // }
  createWindow()
  console.log(`提醒触发：${reminder.text}`)
}

/********************************************************************************
 * @brief: 创建提醒窗口
 * @return {*}
 ********************************************************************************/
const createWindow = async () => {
  const { width, height } = await win.myApi.getScreenSize()
  // console.log(router)
  // console.log(router.currentRoute.value.path)
  const winHeight = height * 0.1
  console.log(winHeight)
  win.myApi.createNewWindow(
    {
      route: '/notice',
    },
    {
      width,
      maxWidth: width,
      height: 110,
      alwaysOnTop: true,
      modal: false,
      x: 0,
      y: 0,
    }
  )
}

/********************************************************************************
 * @brief: 删除提醒
 * @param {*} id
 * @return {*}
 ********************************************************************************/
const removeReminder = id => {
  const index = reminders.findIndex(r => r.id === id)
  if (index > -1) {
    // 双重保障清除定时器
    clearTimeout(reminders[index].timerId)
    reminders[index].timerId = null
    reminders.splice(index, 1)
  }
}

// 组件卸载时清除所有定时器
onUnmounted(() => {
  reminders.forEach(reminder => {
    clearTimeout(reminder.timerId)
  })
})

/********************************************************************************
 * @brief: 更新配置值
 * @param {*} newObj 更新的值
 * @param {*} config 配置值
 * @return {*}
 ********************************************************************************/
const valueUpdate = (newObj: Object, config: Object) => {
  Object.keys(config).forEach(key => {
    if (key in newObj) {
      config[key] = newObj[key]
    }
  })
}
</script>

<template>
  <div id="notice-list-content">
    <div class="reminder-app">
      <!-- 添加提醒表单 -->
      <div class="add-reminder">
        <input
          v-model="newReminder.text"
          placeholder="提醒内容"
        />

        <!-- <select v-model="newReminder.type">
          <option value="interval">间隔提醒</option>
          <option value="daily">每日定时</option>
        </select> -->

        <!-- 类型选择 -->
        <!-- <select v-model="newReminder.category">
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category === 'info' ? '信息' : category === 'warning' ? '警告' : '错误' }}
          </option>
        </select> -->
        <SelectDropTool
          :config="selectDropData[0]"
          @update:config="valueUpdate($event, selectDropData[0])"
          :pattern="selectPattern"
        />

        <!-- 重复时间 -->
        <div v-if="newReminder.type === 'interval'">
          <input
            type="number"
            v-model.number="intervalConfig.value"
            min="1"
          />
          <!-- <select v-model="intervalConfig.unit">
            <option value="minute">分钟</option>
            <option value="hour">小时</option>
          </select> -->
        </div>
        <SelectDropTool
          :config="selectDropData[1]"
          @update:config="valueUpdate($event, selectDropData[1])"
          :pattern="selectPattern"
        />

        <!-- 固定时间 -->
        <!-- <div v-else>
          <input
            type="time"
            v-model="dailyTime"
            required
          />
        </div> -->

        <div
          id="add-button"
          @click="addReminder"
        >
          添加提醒
        </div>
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
            <p>
              分类:
              {{
                reminder.category === 'info'
                  ? '信息'
                  : reminder.category === 'warning'
                  ? '警告'
                  : '错误'
              }}
            </p>
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
    max-width: 680px;
    margin: 20px auto;
    // padding: 20px;
  }

  .add-reminder {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    @include global.style_common(
      20px,
      rgb(191, 228, 244),
      null,
      global.$shadow1
    );
    input {
      @include global.wh(100%, 50px);
      border: none;
      text-align: center;
      font-size: 18px;
      font-family: 'ceyy';
      @include global.style_common(
        10px,
        rgba(255, 255, 255, 1),
        null,
        global.$shadow1
      );
      margin-bottom: 20px;
    }
    #add-button {
      @include global.wh(100%, 60px);
      @include global.style_common(
        20px,
        rgb(249, 221, 221),
        null,
        global.$shadow1
      );
      border-radius: 10px;
      @include global.flex_center;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .reminder-list {
    @include global.wh(100%, 180px);
    @include global.style_common(
      15px,
      rgb(255, 255, 255),
      2px solid #ddd,
      global.$shadow1
    );
    padding: 10px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 10px;
    >div {
      border-radius: 6px;
    }
    .content {
      @include global.wh(100%, 60px);
      @include global.flex_config(1, space-between);
      align-items: flex-start;
    }

    button {
      @include global.wh(30%, 80%);
      @include global.style_common(
        10px,
        rgb(255, 255, 255),
        2px solid #ddd,
        global.$shadow1
      );
      cursor: pointer;
    }
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
