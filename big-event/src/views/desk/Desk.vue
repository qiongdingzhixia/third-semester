<script setup>
import {
    Edit,
    Delete,
    ForkSpoon
} from '@element-plus/icons-vue'
import { ref } from 'vue'

//声明数据
const desks = ref([
    {
        "id": 1,
        "title": "凤凰桌66666666666",
        "state": "未占用",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    }
])

//声明数据模型
const deskModel = ref({
    title: '',
    state: ''
})

//声明查询状态变量
const state = ref('')
//声明弹窗标题
const title = ref('')
//声明弹窗显示变量
const dialogVisible = ref(false)

//清空模型的数据
const clearData = () => {
    deskModel.value.title = '';
    deskModel.value.state = '';
}


//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(4)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    deskList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    deskList()
}

//声明一个异步的函数
import { deskListService, deskAddService, deskUpdateService, deskDeleteService } from '@/api/desk.js'

const deskList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        state: state.value ? state.value : null
    }
    let result = await deskListService(params);

    //渲染视图
    total.value = result.data.total;
    desks.value = result.data.items;
}

deskList();

//添加餐桌
import {ElMessage} from 'element-plus'
const addDesk = async ()=>{

    //调用接口
    let result = await deskAddService(deskModel.value);

    ElMessage.success(result.message? result.message:'添加成功');

    //让抽屉消失
    dialogVisible.value = false;

    //刷新当前列表
    deskList()
}

//更新信息
const updateDesk = async () => {

    let result = await deskUpdateService(deskModel.value);

    ElMessage.success(result.message ? result.message : '修改成功')

    //调用获取所有分类的函数
    deskList();

    //隐藏抽屉
    dialogVisible.value = false;
}

//展示编辑抽屉
const showDialog = (row) => {
    dialogVisible.value = true; title.value = '编辑桌位'
    //数据拷贝
    deskModel.value.title = row.title;
    deskModel.value.state = row.state;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    deskModel.value.id = row.id
}

//删除分类
import {ElMessageBox} from 'element-plus'
const deleteDesk = (row) => {
    //提示用户  确认框

    ElMessageBox.confirm(
        '你确认要删除该桌位信息吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            let result = await deskDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            deskList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>餐桌管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="dialogVisible = true; title = '添加餐桌'; clearData()">添加餐桌</el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="餐桌状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已占用" value="已占用"></el-option>
                    <el-option label="未占用" value="未占用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="deskList">搜索</el-button>
                <el-button @click="state = ''">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="desks" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="桌名" prop="title"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteDesk(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页条 -->
        <el-pagination :current-page="pageNum" :page-sizes="[4, 8, 12]" :page-size="pageSize" :total="total"
            layout="jumper, total, sizes, prev, pager, next" @current-change="onCurrentChange"
            @size-change="onSizeChange" style="margin-top: 20px; justify-content: flex-end">
        </el-pagination>

        <!-- 添加点餐弹窗 -->
        <el-dialog v-model="chooseVisible" :title="title" width="60%">
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="chooseVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加餐桌' ? addfooddetail() : updatefooddetail()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="deskModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="桌名" prop="title">
                    <el-input v-model="deskModel.title" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select placeholder="请选择" v-model="deskModel.state">
                        <el-option label="已占用" value="已占用"></el-option>
                        <el-option label="未占用" value="未占用"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加餐桌' ? addDesk() : updateDesk()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.data {
  display: flex;
  flex-wrap: wrap;
}

.data-item {
  flex: 0 0 25%;
  padding: 10px;
}

.data-button {
  width: 100%;
  height: 100px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>