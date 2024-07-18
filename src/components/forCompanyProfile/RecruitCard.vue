<template>
  <LoadingJumpBall v-if="show_loading" />
  <n-card v-else class="card">
    <div class="header">
      <n-button
        round
        secondary
        class="button"
        v-if="isManager"
        @click="handleShowAddRequirementModal"
      >
        <n-text style="font-size: 19px; font-weight: bold; margin-left: 5%">发布岗位</n-text>
      </n-button>
      <n-modal v-model:show="showAddRequirementModal">
        <n-card class="modal-card" title="发布岗位信息">
          <template #header-extra> </template>
          <n-form
            ref="addRequirementFormRef"
            :model="addRequirementForm"
            :rules="addRequirementRules"
          >
            <n-form-item label="岗位名称" path="title">
              <n-input v-model:value="addRequirementForm.title" placeholder="" />
            </n-form-item>
            <n-form-item label="岗位描述" path="description">
              <n-input
                v-model:value="addRequirementForm.description"
                placeholder=""
                type="textarea"
                :autosize="{
                  minRows: 3
                }"
              />
            </n-form-item>
            <n-form-item label="招聘数量" path="count">
              <n-input v-model:value="addRequirementForm.count" placeholder="" />
            </n-form-item>
            <n-form-item label="工作地点" path="job_position">
              <n-input v-model:value="addRequirementForm.job_position" placeholder="" />
            </n-form-item>
            <n-form-item label="薪资待遇" path="salary">
              <n-input v-model:value="addRequirementForm.salary" placeholder="" />
            </n-form-item>
            <n-form-item label="岗位方向" path="feature">
              <n-select
                v-model:value="addRequirementForm.feature"
                multiple
                :options="options"
                placeholder=""
              />
            </n-form-item>
            <div style="display: flex; justify-content: flex-end">
              <n-button type="primary" @click="handleAddRequirement">保存修改</n-button>
            </div>
          </n-form>
        </n-card>
      </n-modal>
    </div>
    <div class="title">
      <n-text style="font-size: 22px; font-weight: bold">招聘岗位</n-text>
    </div>
    <div class="post">
      <n-grid :cols="2" x-gap="16" y-gap="16">
        <n-grid-item v-for="(post, index) in jobRequirementList" :key="index">
          <JobInfoCard
            :title="post.title"
            :job_position="post.job_position"
            :count="post.count"
            :salary="post.salary"
            :requirement_id="post.id"
            :is-manager="isManager"
            :job_id="post.id"
            :user_num="post.user_num"
            :company_avatar="company_avatar"
            :is-submit="post.is_delivered"
            @deleteRequirement="deleteRequirement"
          />
        </n-grid-item>
      </n-grid>
    </div>
    <n-divider />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import JobInfoCard from '@/components/forCompanyProfile/JobInfoCard.vue'
import { companyRequirementsPublish, userGetRequirementList } from '@/api/apiList.js'
const props = defineProps({
  company_id: { type: Number, required: true },
  isManager: { type: Boolean, required: true },
  company_avatar: { type: String, required: true }
})
let show_loading = ref(true)
const jobRequirementList = ref([])
onMounted(() => {
  show_loading.value = true
  userGetRequirementList({
    id: props.company_id
  }).then((res) => {
    if (res.errno === 0) {
      jobRequirementList.value = res.data
    }
    show_loading.value = false
  })
})

//发布岗位
const addRequirementFormRef = ref(null)
const addRequirementForm = ref({
  title: '',
  description: '',
  count: '',
  job_position: '',
  salary: '',
  feature: []
})
const showAddRequirementModal = ref(false)
const addRequirementRules = {
  title: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入岗位描述', trigger: 'blur' }],
  count: [{ required: true, message: '请输入招聘数量', trigger: 'blur' }],
  job_position: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资待遇', trigger: 'blur' }],
  feature: [{ required: true, type: 'array', message: '请输入岗位方向', trigger: 'blur' }]
}
const options = [
  { label: 'Java', value: 'Java' },
  { label: 'C#', value: 'C#' },
  { label: '全栈工程师', value: '全栈工程师' },
  { label: 'Hadoop', value: 'Hadoop' },
  { label: 'C/C++', value: 'C/C++' },
  { label: '.NET', value: '.NET' },
  { label: '机器学习', value: '机器学习' },
  { label: '运维', value: '运维' },
  { label: '前端开发', value: '前端开发' },
  { label: '后端开发', value: '后端开发' },
  { label: '产品经理', value: '产品经理' },
  { label: '游戏策划', value: '游戏策划' },
  { label: '运营', value: '运营' },
  { label: '美术', value: '美术' },
  { label: '写作', value: '写作' },
  { label: '演员', value: '演员' },
  { label: '新闻', value: '新闻' },
  { label: '行政', value: '行政' },
  { label: '法务', value: '法务' },
  { label: '会计', value: '会计' },
  { label: '教师', value: '教师' },
  { label: '销售', value: '销售' },
  { label: '外卖', value: '外卖' },
  { label: '建筑', value: '建筑' },
  { label: '医生', value: '医生' },
  { label: '机械制造', value: '机械制造' },
  { label: '厨师', value: '厨师' },
  { label: '银行', value: '银行' }
]
const handleShowAddRequirementModal = () => {
  showAddRequirementModal.value = true
}

const handleAddRequirement = () => {
  companyRequirementsPublish({
    title: addRequirementForm.value.title,
    description: addRequirementForm.value.description,
    count: addRequirementForm.value.count,
    job_position: addRequirementForm.value.job_position,
    salary: addRequirementForm.value.salary,
    feature: addRequirementForm.value.feature
  }).then((res) => {
    console.log(addRequirementForm.value.feature)
    if (res.errno === 0) {
      show_loading.value = true
      userGetRequirementList({
        id: props.company_id
      }).then((res) => {
        if (res.errno === 0) {
          jobRequirementList.value = res.data
        }
        show_loading.value = false
      })
      showAddRequirementModal.value = false
      addRequirementForm.value = {
        title: '',
        description: '',
        count: '',
        job_position: '',
        salary: '',
        feature: []
      }
    }
  })
}
//取消招聘回调
const deleteRequirement = () => {
  userGetRequirementList({
    id: props.company_id
  }).then((res) => {
    if (res.errno === 0) {
      jobRequirementList.value = res.data
    }
  })
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1vh;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.modal-card {
  display: flex;
  flex-direction: column;
  width: 48vw;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.header {
  position: absolute;
  top: 3vh;
  right: 2%;
}
.button {
  width: 8vw;
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
.post {
  display: flex;
  gap: 5%;
}
.footer {
  display: flex;
  justify-content: center;
}
</style>
