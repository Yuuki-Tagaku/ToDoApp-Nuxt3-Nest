<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VBtn, VTextField } from 'vuetify/components'

const API_URL = 'http://localhost:4000/items/'

interface Task {
  id: string
  name: string
  done: boolean
}

const taskNameList: Ref<Task[]> = ref([])
const taskName = ref('')
const loading = ref(true)

// データをフェッチする関数
const fetchData = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    taskNameList.value = (await response.json()) as Task[]
  } catch (error) {
    console.error('There was a problem fetching the data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// タスクを追加する関数
const addTask = async () => {
  if (taskName.value.trim() === '') {
    return
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: taskName.value }),
    })
    if (!response.ok) {
      throw new Error('Failed to add item')
    }
    // 新しいタスクリストを再フェッチして表示を更新する
    await fetchData()
    taskName.value = ''
  } catch (error) {
    console.error('There was a problem adding the item:', error)
  }
}

// タスクを完了または削除する関数
const completeTask = async (taskId: string) => {
  try {
    // 完了したタスクのdoneフラグを更新する
    const index = taskNameList.value.findIndex((task) => task.id === taskId)
    if (index !== -1) {
      taskNameList.value[index].done = true
    }
    const response = await fetch(`${API_URL}done/${taskId}`, {
      method: 'PUT',
    })
    if (!response.ok) {
      throw new Error('Failed to complete item')
    }
    // 新しいタスクリストを再フェッチして表示を更新する
    await fetchData()
    taskName.value = ''
  } catch (error) {
    console.error('There was a problem completing the item:', error)
  }
}
</script>

<template>
  <div v-if="!loading">
    <div class="container">
      <h1>ToDo App</h1>
      <div style="display: flex; margin-top: 20px">
        <VTextField
          v-model="taskName"
          label="Write a task …"
          variant="underlined"
          solo
        />
        <VBtn @click="addTask" class="add-btn" color="success">Add</VBtn>
      </div>
      <h2 class="sub-title">Added Tasks</h2>
      <ul>
        <li v-for="task in taskNameList" :key="task.id">
          <div v-if="!task.done">
            {{ task.name }}
            <VBtn
              class="complete-btn"
              size="small"
              @click="completeTask(task.id)"
              >Done</VBtn
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped>
.container {
  text-align: center;
  max-width: 600px;
  margin: 40px auto;
  padding: 0px 30px;
}
.sub-title {
  text-align: left;
  margin-top: 30px;
}
ul {
  list-style-type: none;
  padding: 0px 5px;
}
li {
  text-align: left;
  margin: 20px 0;
}
.add-btn {
  margin: 10px 10px;
}
.complete-btn {
  margin: 0px 10px;
}
</style>
