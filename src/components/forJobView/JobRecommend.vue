<template>
  <div v-if="isVisible" class="card-container">
    <n-page-header class="card-item">
      <template #header>
        <n-grid :cols="12">
          <n-gi :offset="0">
            <n-button quaternary disabled>职位推荐</n-button>
          </n-gi>
        </n-grid>
      </template>
    </n-page-header>
    <div class="job-details">
      <div class="image-container">
        <img :src="datas.avatar_src" alt="Company Logo" class="avatar" />
      </div>
      <div class="details-text">
        <h2 @click="navigateToJob" class="blue-text underline-on-hover">{{ datas.position }}</h2>
        <h3>{{ datas.company }}</h3>
        <p class="gray-text">职位简介：{{ datas.description }}</p>
        <h4 class="green-text">公司地点：{{ datas.location }}</h4>
        <h4 class="green-text">薪资待遇：{{ datas.salary }}</h4>
        <p>{{}}</p>
        <p>{{}}</p>
        <p>{{}}</p>
        <p>{{}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index.js'

function navigateToJob() {
  router.push({ name: 'JobDetailsView', query: { id: datas.id } })
}

const props = defineProps({
  jobData: {
    type: Object,
    required: true
  },
  isFirstCard: {
    type: Boolean,
    required: true
  }
})

let datas = reactive({
  avatar_src: '',
  position: '',
  company: '',
  location: '',
  salary: '',
  id: '',
  description: ''
})

const isVisible = ref(true)

function update_job_data() {
  if (props.jobData && props.jobData.company) {
    datas.avatar_src = props.jobData.company.img || ''
    datas.position = props.jobData.title || ''
    datas.company = props.jobData.company.name || ''
    datas.location = props.jobData.job_position || ''
    datas.salary = props.jobData.salary || ''
    datas.id = props.jobData.id || ''
    datas.description = props.jobData.description
  }
}

watch(
  () => props.jobData,
  () => {
    update_job_data()
  },
  { immediate: true }
)

update_job_data()
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
</style>
