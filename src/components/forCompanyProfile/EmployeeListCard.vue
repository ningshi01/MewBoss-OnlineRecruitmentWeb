<template>
  <n-card class="card">
    <div class="header">
      <n-button round secondary class="button" v-if="false">
        <n-text style="font-size: 19px; font-weight: bold; margin-left: 5%">转移管理员权限</n-text>
      </n-button>
    </div>
    <div class="title">
      <n-text style="font-size: 22px; font-weight: bold">员工列表</n-text>
    </div>
    <div>
      <n-grid :cols="4" x-gap="16" y-gap="16">
        <n-grid-item v-for="(employee, index) in employeeList" :key="index">
          <n-dropdown
            trigger="hover"
            :options="options"
            @select="(key) => handleSelect(key, employee.id)"
          >
            <n-card class="employee-card" @click="goEmployeeProfile(employee.id)">
              <div class="left">
                <n-avatar round :size="60" :src="employee.userprofile.avatar" />
              </div>
              <div class="right">
                <n-text style="font-size: 20px; font-weight: bold">
                  {{ employee.username }}
                </n-text>
                <n-text style="font-size: 15px; color: grey"
                  >{{ employee.fan_count }} 位关注者</n-text
                >
              </div>
            </n-card>
          </n-dropdown>
        </n-grid-item>
      </n-grid>
    </div>
    <n-divider />
    <div class="footer"></div>
  </n-card>
</template>
<script setup>
import {
  companyEmployeeDelete,
  companyEmployeeListGet,
  companyManagerChange
} from '@/api/apiList.js'
import { useRouter } from 'vue-router'

const employeeList = ref([])

onMounted(() => {
  companyEmployeeListGet().then((res) => {
    if (res.errno === 0) {
      employeeList.value = res.data
    }
  })
})
const router = useRouter()
const goEmployeeProfile = (id) => {
  router.push({ name: 'UserProfile', query: { id: id } })
}
const options = [
  { label: '转移管理员权限', key: 'change' },
  { label: '移出企业', key: 'delete' }
]
const message = useMessage()
const handleSelect = (key, id) => {
  if (key === 'change') {
    companyManagerChange({
      id: id
    }).then((res) => {
      if (res.errno === 0) {
        message.success('发送成功')
      }
    })
  } else {
    companyEmployeeDelete({
      user_id: id
    }).then((res) => {
      if (res.errno === 0) {
        message.success('删除成功')
      }
    })
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1vh;
  width: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.header {
  position: absolute;
  top: 3vh;
  right: 2%;
}
.button {
  width: 15vw;
  margin-top: 1%;
  border: 2px solid black;
  transition: all 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
  flex-grow: 1;
}
.footer {
  display: flex;
  justify-content: center;
}
.employee-card {
  --n-padding-left: 0 !important;
  cursor: pointer;
  padding-left: 1vw;
  align-items: center;
}
.right {
  display: flex;
  flex-direction: column;
}
</style>
