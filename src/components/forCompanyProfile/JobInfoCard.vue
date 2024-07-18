<template>
  <n-card class="postCard" hoverable>
    <div class="postCard-content" @click="showRequirementDetail">
      <n-avatar class="avatar" :src="props.company_avatar"></n-avatar>
      <n-text style="font-size: 19px; font-weight: bold; margin-top: 4%">{{ title }}</n-text>
      <n-text style="font-size: 16px">办公地点: {{ job_position }}</n-text>
      <n-text style="font-size: 15px; color: grey">招聘人数: {{ count }}</n-text>
      <n-text style="font-size: 15px; color: grey">录用人数: {{ user_num }}</n-text>
      <n-text style="font-size: 15px; color: grey">薪资: {{ salary }}</n-text>
    </div>
    <div class="footer-button">
      <n-button
        round
        type="info"
        v-if="!isManager"
        @click.stop="handleShowSubmitResumeModal"
        :disabled="isSubmit"
      >
        <n-text style="font-size: 15px; font-weight: bold; color: white">投递简历</n-text>
      </n-button>
      <n-modal v-model:show="showSubmitResumeModal">
        <n-card class="modal-card" title="投递简历">
          <template #header-extra> </template>
          <n-form ref="submitResumeFormRef" :model="submitResumeForm" :rules="submitResumeRules">
            <n-form-item label="申请说明" path="info" :required="true">
              <n-input
                v-model:value="submitResumeForm.info"
                placeholder=""
                type="textarea"
                :autosize="{
                  minRows: 3
                }"
              />
            </n-form-item>
            <div style="display: flex; justify-content: flex-end">
              <n-button type="primary" @click="postResume">确认</n-button>
            </div>
          </n-form>
        </n-card>
      </n-modal>
      <n-button round type="info" v-if="isManager" @click.stop="removeRequirement">
        <n-text style="font-size: 15px; font-weight: bold; color: white">取消招聘</n-text>
      </n-button>
    </div>
  </n-card>
</template>

<script setup>
import { companyRequirementsDelete, userResumePost } from '@/api/apiList.js'
import router from '@/router/index.js'
import { ref } from 'vue'
const props = defineProps({
  title: { type: String, required: true },
  job_position: { type: String, required: true },
  count: { type: Number, required: true },
  user_num: { type: Number, required: true },
  salary: { type: String, required: true },
  requirement_id: { type: Number, required: true },
  isManager: { type: Boolean, required: true },
  job_id: { type: Number, required: true },
  isSubmit: { type: Boolean, required: true },
  company_avatar: { type: String, required: true }
})

const message = useMessage()
const emits = defineEmits(['deleteRequirement'])

const removeRequirement = () => {
  companyRequirementsDelete({
    job_id: props.job_id
  }).then((res) => {
    if (res.errno === 0) {
      message.success('成功取消')
      emits('deleteRequirement')
    }
  })
}
//投递简历
const showSubmitResumeModal = ref(false)
const submitResumeFormRef = ref(null)
const submitResumeForm = ref({ info: '' })

const submitResumeRules = {
  info: [{ required: true, message: '请输入申请说明', trigger: 'blur' }]
}
const handleShowSubmitResumeModal = () => {
  showSubmitResumeModal.value = true
}
const postResume = () => {
  userResumePost({
    requirement_id: props.requirement_id,
    message: submitResumeForm.value.info
  }).then((res) => {
    if (res.errno === 0) {
      message.success('成功投递')
      showSubmitResumeModal.value = false
      emits('deleteRequirement')
    }
  })
}
//
const showRequirementDetail = () => {
  router.push({ name: 'JobDetailsView', query: { id: props.job_id } })
}
</script>

<style scoped>
.postCard {
  border: 1px solid #ccc;
  border-radius: 10px;
  height: 37vh;
}
.modal-card {
  display: flex;
  flex-direction: column;
  width: 48vw;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.postCard-content {
  display: flex;
  flex-direction: column;
}
.avatar {
  width: 6vw;
  height: 10.8vh;
}
.footer-button {
  position: absolute;
  bottom: 2vh;
  left: 35%;
}
</style>
