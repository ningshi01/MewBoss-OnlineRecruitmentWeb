<template>
  <div v-if="isVisible">
    <div v-if="jobs.length === 0" class="no-jobs-container">
      <p class="no-jobs-message">您暂未投递任何职位，请去查看招聘信息进行投递！</p>
      <img src="../../assets/cat2.svg" alt="No Jobs" class="no-jobs-image" />
    </div>
    <div v-else>
      <div class="card-container" v-for="job in jobs" :key="job.id">
        <n-page-header class="card-item">
          <template #header>
            <n-grid :cols="12">
              <n-gi :offset="0">
                <n-button quaternary disabled>我的职位</n-button>
              </n-gi>
            </n-grid>
          </template>
        </n-page-header>
        <div class="job-details">
          <div class="image-container">
            <img :src="job.requirement.company.img" alt="Company Logo" class="avatar" />
          </div>
          <div class="details-text">
            <h2 @click="navigateToJob(job.requirement.id)" class="blue-text underline-on-hover">
              {{ job.requirement.title }}
            </h2>
            <h3>{{ job.requirement.company.name }}</h3>
            <p class="gray-text">职位简介：{{ job.requirement.description }}</p>
            <h4 class="green-text">公司地点：{{ job.requirement.job_position }}</h4>
            <h4 class="green-text">薪资待遇：{{ job.requirement.salary }}</h4>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index.js'
import { userApplyGet } from '@/api/apiList.js'
import { ref, onMounted } from 'vue'

function navigateToJob(id) {
  router.push({ name: 'JobDetailsView', query: { id } })
}

const isVisible = ref(true)
const jobs = ref([])

onMounted(() => {
  userApplyGet({}).then((res) => {
    if (res.errno === 0) {
      if (res.data.length === 0) {
        console.log('暂未投递任何职位！')
      } else {
        jobs.value = res.data
      }
    }
  })
})
</script>

<style scoped>
.details-text h2,
.details-text h3,
.details-text h4,
.details-text p {
  margin: 2px 0;
}

.card-container {
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 15px;
  margin-top: 10px;
  width: 90%;
  background-color: rgb(255, 255, 255);
}
.card-item {
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-family: Arial;
}
.job-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
}
.image-container {
  margin-left: 40px;
}
.avatar {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
.details-text {
  display: flex;
  flex-direction: column;
  margin-left: 60px;
}
.blue-text {
  color: #1e90ff;
}
.underline-on-hover:hover {
  text-decoration: underline;
}
.gray-text {
  color: #606060;
}
.green-text {
  color: darkgreen;
}
.no-jobs-container {
  margin-top: 20px;
}
.no-jobs-image {
  width: 800px;
  height: 550px;
  display: block;
  margin: 0 auto;
}
.no-jobs-message {
  font-size: 18px;
  color: #606060;
  margin-top: 20px;
  margin-left: 100px;
}
</style>
