<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//import useOrderInfoStore from '@/stores/orderDetail.js'
//const orderInfoStore = useOrderInfoStore();

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    }
])

//文章列表数据模型
const articles = ref([

])

//桌列表数据模型
const desks = ref([

])

//食品详情数据模型
const foodOrderDetail = ref([

])


const userNumberModel =ref({
    userNumber: ''
})
//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的桌号id
const deskId = ref('')

//用户搜索时选中的订单
const orderId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//判断显示哪张表
const showTable = ref(true)
const showOrder = ref(false)

//定义添加订单详情判断标志
const dialogVisible =ref(false)
//定义添加订单的信息
const oderDialogVisible =ref(false)
//定义确认订单对话框
const oderSureVisible =ref(false)

//定义最终价格
const finalPrice =ref (0)

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

const pageNumOrder = ref(1)//当前页
const totalOrder = ref(20)//总条数
const pageSizeOrder = ref(10)//每页条数

const rules = {
    userNumber: [
        {
            validator: (rule, value, callback) => {
                const reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入有效的中国手机号码'));
                }
            },
            trigger: 'blur'
        }
    ],
    count: [
        {
            validator: (rule, value, callback) => {
                const intValue = parseInt(value);
                if (intValue > 0 && Number.isInteger(intValue)) {
                    callback();
                } else {
                    callback(new Error('请输入正确份数'));
                }
            },
            trigger: 'blur'
        }
    ]
}
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
const onSizeChangeOrder = (size) => {
    pageSizeOrder.value = size
    OrderdetailList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}
const onCurrentChangeOrder = (num) => {
    pageNumOrder.value = num
    OrderdetailList()
}

//回显桌子信息
import { deskListService } from '@/api/desk.js'
const deskList = async () => {
    let params = {
        pageNum: 1,
        pageSize: 1000,
    }
    let result = await deskListService(params);

    desks.value = result.data.items;
}
deskList();

//回显文章分类
import { articleCategoryListService, articleListService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();

    categorys.value = result.data;
}

//获取文章列表数据
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);

    //渲染视图
    total.value = result.data.total;
    articles.value = result.data.items;

    //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}


articleCategoryList()
articleList();


const showDialog = (row) => {
    dialogVisible.value = true;
    //数据拷贝
    orderdetailModel.value.createDesk = deskId.value;
    orderdetailModel.value.createOrder = orderId.value;
    //orderdetailModel.value.count = row.count;
    orderdetailModel.value.content= row.title;
    orderdetailModel.value.state= '未结付';
    //orderdetailModel.value.price= row.price;
    orderdetailModel.value.userNumber= 18226006985;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    /* orderdetailModel.value.id = row.id */
}

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: '',
    price: ''
})

//定义订单详情数据模型
const orderdetailModel = ref({
    createDesk: '',
    createOrder: '',
    state: '',
    userNumber: '',
    content: '',
    count: '',
    price: ''
})

//定义订单数据模型
const orderModel = ref({
    createDesk: '',
    state: '',
    userNumber: '',
    price: '',
})


const resultIdModel=ref({
        id: '',
        createUser: '',
        createDesk: '',
        state: '',
        userNumber: '',
        createTime: '',
        updateTime: '',
        price: ''
})

import { orderdetailListService, orderdetailAddService, orderdetailDeleteService, orderdetailUpdateService} from '@/api/orderdetail.js'

const OrderdetailList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        createDesk: deskId.value ? deskId.value : null,
        state: '未结付'
    }
    let result = await orderdetailListService(params);

    //渲染视图
    totalOrder.value = result.data.total;
    foodOrderDetail.value = result.data.items;

   /*  //处理数据,给数据模型扩展一个属性categoryName,分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    } */
}
OrderdetailList()


//添加文章
import {ElMessage} from 'element-plus'
const addOrderdetail = async ()=>{

    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        if(orderdetailModel.value.content == article.title){
            orderdetailModel.value.price=article.price * orderdetailModel.value.count;
        }
    }
    orderdetailModel.value.createDesk=deskId.value
    /* if (!orderId.value) {
        orderId.value = { ...orderInfoStore.info }; // 将 orderId 的值设置为 orderInfoStore.info 的浅拷贝
    } */
    //console.log(orderId.value)
    orderdetailModel.value.createOrder=orderId.value

    finalPrice.value = finalPrice.value + parseFloat(orderdetailModel.value.price)
    //调用接口
    let result = await orderdetailAddService(orderdetailModel.value);

    ElMessage.success(result.message? result.message:'添加成功');

    //刷新当前列表
    OrderdetailList()
}

//更新信息
const updateOrderdetail = async (order) => {
    //调用接口
    let result = await orderdetailUpdateService(order);

    ElMessage.success(result.message ? result.message : '修改成功')

    //调用获取所有分类的函数
    OrderdetailList();

    //隐藏抽屉
    oderSureVisible.value = false;
}

//删除分类
import {ElMessageBox} from 'element-plus'
const deleteOrderdetail = (row) => {
    //提示用户  确认框

    ElMessageBox.confirm(
        '你确认要删除该分类信息吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            finalPrice.value = finalPrice.value - parseFloat(row.price)
            let result = await orderdetailDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            OrderdetailList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}


import { orderAddService, orderUpdateService, orderIdService} from '@/api/order.js'
import { customerAddService, customerFindService } from '@/api/customer.js';


const addOrder = async ()=>{

 //调用接口
orderModel.value.state = '未结付'
orderModel.value.createDesk = deskId;
orderModel.value.price = 0;

 let result = await orderAddService(orderModel.value);

ElMessage.success(result.message? result.message:'添加成功');

 let params= {
    userNumber: orderModel.value.userNumber,
    state: '未结付'
}


let paramsCus = {
        userNumber: orderModel.value.userNumber,
    }
let resultCus = await customerFindService(paramsCus);

    if(resultCus.data == null){

        userNumberModel.value.userNumber = orderModel.value.userNumber
        await customerAddService(userNumberModel.value);

    }

let resultId= await orderIdService(params)

resultIdModel.value= resultId.data

orderId.value=resultIdModel.value.id
//orderInfoStore.setInfo(orderId.value)
orderModel.value.id=orderId.value
//console.log(orderId.value)
//让抽屉消失
oderDialogVisible.value = false;

}



const updateOrderData = () => {
    orderModel.value.createDesk=deskId.value;
    orderModel.value.state='未结付';
    orderModel.value.price=finalPrice.value;
}




const updateOrder = async ()=>{


    foodOrderDetail.value.forEach(order => {
    // 假设这里根据你的业务逻辑修改 state 的值
    order.state = '已结付'; // 举例将 state 改为 'completed'

    let resultdetail = updateOrderdetail(order);

    //orderInfoStore.removeInfo();
});

    orderModel.value.state='未结付';
    //调用接口
    let result = await orderUpdateService(orderModel.value);

    ElMessage.success(result.message ? result.message : '修改成功')

    //调用获取所有分类的函数
    articleList();
    OrderdetailList();

}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <el-form-item label="选择桌号：">
                    <el-select placeholder="请选择" v-model="deskId">
                        <el-option v-for="d in desks" :key="d.id" :label="d.title" :value="d.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="extra" style="margin-right: 20px;">
                    <el-button type="success" @click="oderDialogVisible = true">开始点餐叭~</el-button>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                <div class="extra">
                    <el-button type="default" @click="showOrder = false ; showTable = true">显示食品</el-button>
                </div>
                <div class="extra">
                    <el-button type="default" @click="showTable = false ; showOrder = true; OrderdetailList()">显示订单详情</el-button>
                </div>
            </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline v-if="showTable">
            <el-form-item label="食品分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="食品状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="有余" value="有余"></el-option>
                    <el-option label="无余" value="无余"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table v-if="showTable" :data="articles" style="width: 100%">
            <el-table-column label="食品名称" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="图片" prop="coverImg">
                <template v-slot="{ row }">
                    <img :src="row.coverImg" alt="食品封面" style="width: 100px; height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="单价/元" prop="price"></el-table-column>
            <el-table-column label="添加时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-if="showTable" v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />



        <!-- 文章列表 -->
        <el-table v-if="showOrder" :data="foodOrderDetail" style="width: 100%">
            <el-table-column label="桌号" prop="createDesk"></el-table-column>
            <el-table-column label="订单号" prop="createOrder"></el-table-column>
            <el-table-column label="桌号" prop="createDesk"></el-table-column>
            <el-table-column label="电话" prop="userNumber"></el-table-column>
            <el-table-column label="菜品" prop="content"> </el-table-column>
            <el-table-column label="数量" prop="count"> </el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteOrderdetail(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-if="showOrder" v-model:current-page="pageNumOrder" v-model:page-size="pageSizeOrder" :page-sizes="[10, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="totalOrder" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <el-button v-if="showOrder" type="primary" @click="oderSureVisible = true; updateOrderData()" >确认订单</el-button>
    </el-card>



        <!-- 添加订单详情弹窗 -->
    <el-dialog v-model="dialogVisible" :title='添加菜品' width="30%">
            <el-form :model="orderdetailModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="菜品名称" prop="content">
                    <el-input v-model="orderdetailModel.content" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="菜品份数" prop="count">
                    <el-input v-model="orderdetailModel.count" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addOrderdetail(); dialogVisible = false"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>


        <!-- 添加订单弹窗 -->
    <el-dialog v-model="oderDialogVisible" :title='添加新订单' width="30%">
            <el-form :model="orderModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="电话号码" prop="userNumber">
                    <el-input v-model="orderModel.userNumber" minlength="1" maxlength="18"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="oderDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addOrder(); oderDialogVisible = false"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加确认订单弹窗 -->
    <el-dialog v-model="oderSureVisible" :title='确认订单' width="30%">
            <el-form :model="resultIdModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="账单ID" prop="id">
                    <el-input v-model="orderModel.id" minlength="1" maxlength="18"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="userNumber">
                    <el-input v-model="orderModel.userNumber" minlength="1" maxlength="18"></el-input>
                </el-form-item>
                <el-form-item label="总价" prop="price">
                    <el-input v-model="orderModel.price" minlength="1" maxlength="18"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateOrder(); dialogVisible = false"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
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

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>