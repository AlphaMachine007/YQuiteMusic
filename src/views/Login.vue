<template>
  <div class="background">
    <el-card shadow="always" class="loginPanel">
      <el-row style="height: 100%;">
        <el-col :xs="0" :sm="12" :md="12" :lg="12" :xl="12" :span="12">
          <div class="charts" ref="charts" id="charts"></div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :span="12" class="panel-right">
          <el-form ref="loginForm" :inline="false" :model="loginInfo" :rules="rules">
            <el-form-item>
              <h1 style="font-family: 'Bauhaus 93'">Welcome！乐享生活</h1>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="loginInfo.account" prop="account" type="number" class="no-spin">
                <template #prepend>
                  <el-button :icon="User" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model.trim="loginInfo.password" type="password">
                <template #prepend>
                  <el-button :icon="Key" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="loginBtn" @click="userLogin">登录</el-button>
              <el-text>没有账号?</el-text>
              <el-link type="info" style="color: white;" @click="openRegister">立即注册</el-link>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
  <!-- 注册模态框 -->
  <el-dialog v-model="registDialog" title="注册账号" align-center>
    <el-form :model="registInfo" label-position="right" label-width="70px" :rules="rules" ref="registForm">
      <el-form-item label="手机号" prop="account">
        <el-input v-model.trim="registInfo.account" autocomplete="off" class="no-spin" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model.trim="registInfo.password" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="registDialog = false">取消</el-button>
        <el-button type="primary" @click="userRegister">
          注册
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as echarts from 'echarts';
import { init } from 'echarts'
import { User, Key } from '@element-plus/icons-vue'
import { useUser } from '@/store/user'
import router from '@/routes';
import { onMounted, ref,reactive } from 'vue';
import { useRoute } from 'vue-router';

let registDialog = ref(false)

let loginInfo = reactive({
  account: '',
  password: ''
})

let registInfo = reactive({
  account: '',
  password: ''
})

// 表单验证
const rules = reactive({
  account: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
})

onMounted(() => {
  initCharts()

})
// 引入用户的store
const user = useUser()
// 获取表单dom
const loginForm = ref(null)
const registForm = ref(null)
const userStore = useUser()
const route = useRoute()
function initCharts() {
  let domCharts = document.getElementById('charts')
  // const charts = ref(null)
  const myCharts = init(domCharts)
  const option = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'YQuiet',
            fontSize: 80,
            fontFamily: 'Broadway',
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#000',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 3000,
            // loop: true,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: 'black'
                }
              }
            ]
          }
        }
      ]
    }
  };
  myCharts.setOption(option)
}
/* 用户登录 */
function userLogin() {
  loginForm.value.validate().then(async (valid) => {
    if (valid) {
      let result = await user.userLogin(loginInfo.account, loginInfo.password)
      if (result.state == 200) {
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        localStorage.setItem('token', result.data.token)
        userStore.handleToken()
        let len = Object.keys(route.query).length
        if (len != 0) {
          router.push({ path: route.query.redirect })
        } else {
          router.push({ path: '/home' })
        }
      } else {
        ElMessage.error('登录失败，请检查账号密码是否正确')
      }
    }
  })
}

/* 用户注册界面 */
function openRegister() {
  registDialog.value = true
}

/* 用户注册 */
function userRegister() {
  registForm.value.validate(async (valid) => {
    if (valid) {
      let result = await user.userRegist(registInfo.account, registInfo.password)
      if (result.state === 200) {
        ElMessage({
          message: '注册成功',
          type: 'success'
        })
        registDialog.value = false
      } else if (result.state === 202) {
        ElMessage.error('该手机号已被注册')
      } else {
        ElMessage.error('注册失败')
      }
    }
  })
}

</script>

<style scoped lang="less">
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('../assets/back.jpg') no-repeat;
  background-size: cover;
  background-position: 50% 70%;

  .loginPanel {
    width: 800px;
    height: 500px;
    border-radius: 10px;

    .charts {
      height: 100%;
      width: 100%;
    }

    .panel-right {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #5CBB7A;
      // #5CBB7A

      :deep(.el-form-item__content) {
        margin: 0;
        padding: 0;
      }

      .loginBtn {
        width: 50%;
      }
    }

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
    }
  }
}

@media screen and (max-width: 768px) {
  .panel-right {
    background: url('../assets/mobileBack.png') no-repeat;
    background-size: cover;
  }
}
</style>

<style>
.no-spin input::-webkit-inner-spin-button,
.no-spin input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>