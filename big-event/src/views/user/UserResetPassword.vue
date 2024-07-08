<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const userInfo = ref({ ...userInfoStore.info })

//定义数据模型
const UpdateData = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== UpdateData.new_pwd) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}
const rules = {
    old_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, validator: checkRePassword, trigger: 'blur' }
    ]
}

//修改个人信息
import { userPwdUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {ElMessageBox} from 'element-plus'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();
const router = useRouter();
const updatePwd = async () => {
    //调用接口
    let result = await userPwdUpdateService(UpdateData.value);
    ElMessage.success(result.message ? result.message : '修改成功');
    //1.清空pinia中存储的token以及个人信息
    tokenStore.removeToken()
    userInfoStore.removeInfo()

    //2.跳转到登录页面
    router.push('/login')

    ElMessage({
                type: 'success',
                message: '已經退出登录',
            })
}
</script>


<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="UpdateData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码" prop="old_pwd">
                        <el-input v-model="UpdateData.old_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="UpdateData.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_pwd">
                        <el-input v-model="UpdateData.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePwd">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>