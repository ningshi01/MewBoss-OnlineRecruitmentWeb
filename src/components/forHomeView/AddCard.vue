<script setup>
const emit = defineEmits(['create_moment'])
const props = defineProps({
  avatar_src: {
    type: String,
    required: true
  }
})
function create_moment() {
  emit('create', 1)
}
</script>

<template>
  <div class="card-container">
    <n-card class="card-content">
      <div style="display: flex; gap: 10px">
        <n-avatar round :size="45" class="avatar" :src="props.avatar_src" />
        <n-input
          readonly
          size="large"
          round
          placeholder="发动态"
          :maxlength="100"
          class="content-input"
          @click="create_moment"
        />
      </div>
      <n-divider style="margin: 10px"></n-divider>
      <div class="card-button-groups">
        <n-button class="card-button" quaternary size="large" strong="true" @click="create_moment">
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56s56-25.072 56-56s-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"
                  fill="#378fe9"
                ></path>
              </svg>
            </n-icon>
          </template>
          媒体
        </n-button>
        <n-button class="card-button" quaternary size="large" strong @click="create_moment">
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="#c37d16"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="4" y="5" width="16" height="16" rx="2"></rect>
                  <path d="M16 3v4"></path>
                  <path d="M8 3v4"></path>
                  <path d="M4 11h16"></path>
                  <path d="M11 15h1"></path>
                  <path d="M12 15v3"></path>
                </g>
              </svg>
            </n-icon>
          </template>
          活动
        </n-button>
        <n-button class="card-button" quaternary size="large" strong @click="create_moment">
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M79.18 282.94a32.005 32.005 0 0 0-20.24 20.24L0 480l4.69 4.69l92.89-92.89c-.66-2.56-1.57-5.03-1.57-7.8c0-17.67 14.33-32 32-32s32 14.33 32 32s-14.33 32-32 32c-2.77 0-5.24-.91-7.8-1.57l-92.89 92.89L32 512l176.82-58.94a31.983 31.983 0 0 0 20.24-20.24l33.07-84.07l-98.88-98.88l-84.07 33.07zM369.25 28.32L186.14 227.81l97.85 97.85l199.49-183.11C568.4 67.48 443.73-55.94 369.25 28.32z"
                  fill="#e06847"
                ></path>
              </svg>
            </n-icon>
          </template>
          写文章
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.card-container {
  padding: 0px;
  border-radius: 15px;
  margin-bottom: 10px;
  width: 100%;
}
.card-content {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.avatar {
}
.content-input {
}
.card-button-groups {
  display: flex;
}
.card-button {
  flex: 1;
  font-weight: bold;
}
</style>
