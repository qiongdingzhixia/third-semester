<script setup>
import {
    Edit,
    Delete,
    Coin
} from '@element-plus/icons-vue'
import { ref } from 'vue'

//声明数据
const orders = ref([
    {
        "id": 1,
        "createDesk": 1,
        "state": "未结付",
        "userNumber": "18226006985",
        "price": 18.8,
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    }
])
//声明数据模型

const discounts = ref([
])

const orderModel = ref({
    createDesk: 1,
    state: "未结付",
    userNumber: "18226006985",
    price: 18.8,
})

const customerModel = ref({
    id: 2,
    userNumber: "18226006985",
    createUser: 19,
})


const discountModel =ref({
    id: 1,
    createCustomer: 1,
    style: '打折',
    quota: 0.8
})

const discountAddModel =ref({
    userNumber: '',
    style: '',
    quota: ''
})
const discountRequestModel =ref({
    createCustomer: '',
    style: '',
    quota: ''
})
const userNumberModel =ref({
    userNumber: ''
})
//声明折扣ID
const discountId = ref('');
//声明折扣额
const quota = ref('')
//声明查询状态变量
const state = ref('')
//声明查询手机号变量
const userNumber = ref('')
//声明顾客ID
const customerId = ref('')
//声明弹窗标题
const title = ref('')
//声明弹窗显示变量
const dialogVisible = ref(false)
//声明折扣弹窗变量
const discountVisible = ref(false)
const discountAddVisible = ref(false)
//清空模型的数据
const clearData = () => {
    orderModel.value.createDesk = '';
    orderModel.value.state = '';
    orderModel.value.userNumber = '';
    orderModel.value.price = '';
}
const clearFinalData = () => {
    quota.value = '';
    discountId.value = '';
}

const clearAddDiscountData = () => {
    discountAddModel.value.userNumber = '';
    discountAddModel.value.style = '';
    discountAddModel.value.quota = '';
}

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(4)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    orderList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    orderList()
}

const rules = {
    createDesk: [
        {
        validator: (rule, value, callback) => {
            const num = Number(value);
            if (Number.isInteger(num) && num > 0) {
                callback();
            } else {
                callback(new Error('请输入正确桌号'));
            }
        },
        trigger: 'blur'
        }
    ],
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
    price: [
        {
            validator: (rule, value, callback) => {
                const reg = /^\d+(\.\d{1,2})?$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入整数或最多两位小数的数字'));
                }
            },
            trigger: 'blur'
        }
    ]
}

//声明一个异步的函数
import { orderListService, orderAddService, orderUpdateService, orderDeleteService } from '@/api/order.js';
import { customerAddService, customerFindService } from '@/api/customer.js';
import { discountListService, discountAddService, discountDeleteService } from '@/api/discount.js';

const orderList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        state: state.value ? state.value : null,
        userNumber: userNumber.value ? userNumber.value : null 
    }
    let result = await orderListService(params);

    //渲染视图
    total.value = result.data.total;
    orders.value = result.data.items;
}

orderList();



//添加餐桌
import {ElMessage} from 'element-plus'
const addOrder = async ()=>{

    //调用接口
    let result = await orderAddService(orderModel.value);

    ElMessage.success(result.message? result.message:'添加成功');

    //让抽屉消失
    dialogVisible.value = false;

    //刷新当前列表
    userNumber.value = '';
    orderList()
}

//更新信息
const updateOrder = async () => {

    orderModel.value.state = '已结付'

    let result = await orderUpdateService(orderModel.value);

    ElMessage.success(result.message ? result.message : '修改成功')

    //调用获取所有分类的函数
    userNumber.value = '';
    orderList();

    //隐藏抽屉
    dialogVisible.value = false;
}

const updateDiscountAndOrder = async () => {


    const price = orderModel.value.price;
    const quotaValue = parseFloat(quota.value); // 将字符串转换为数字

    if (quotaValue < 1) {
        orderModel.value.price = price * quotaValue;
    }else if(quotaValue >= 1){
        orderModel.value.price = price - quotaValue;
    }
    else{
        orderModel.value.price = price
    }

    let result = await orderUpdateService(orderModel.value);

    ElMessage.success(result.message ? result.message : '修改成功')

    //调用获取所有分类的函数
    userNumber.value = '';
    orderList();

    //console.log(discountId.value)

    let result1 = await discountDeleteService(discountId.value);
    //隐藏抽屉
    discountVisible.value = false;

}

//展示编辑抽屉
const showDialog = (row) => {
    dialogVisible.value = true; title.value = '查看订单'
    //数据拷贝
    orderModel.value.createDesk = row.createDesk;
    orderModel.value.state = row.state;
    orderModel.value.userNumber = row.userNumber;
    orderModel.value.price = row.price;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    orderModel.value.id = row.id
}

//添加折扣
const addDiscount = async ()=>{

discountRequestModel.value.quota = discountAddModel.value.quota
discountRequestModel.value.style = discountAddModel.value.style
let params = {
        userNumber: discountAddModel.value.userNumber,
    }
    
    let result1 = await customerFindService(params);
    //console.log(result1)
    discountRequestModel.value.createCustomer = result1.data.id

//调用接口
let result = await discountAddService(discountRequestModel.value);

ElMessage.success(result.message? result.message:'添加成功');

//让抽屉消失
discountAddVisible.value = false;

}

//展示折扣
const showDialogDiscount = async (row) => {
    //orderModel.value.id = row.id
    userNumber.value=row.userNumber

    let params = {
        userNumber: userNumber.value,
    }

    let result = await customerFindService(params);

    if(result.data == null){

        userNumberModel.value.userNumber = userNumber.value
        customerAddService(userNumberModel.value);
        result = await customerFindService(params);
        //console.log(result);
    }

    customerId.value = result.data.id

    let params2 = {
        createCustomer: customerId.value,
        //style: '打折'
    }
    let params3 = {
        createCustomer: customerId.value,
        style: '减免'
    }
    discounts.value = await discountListService(params2);

    discountVisible.value = true;
}

//删除分类
import {ElMessageBox} from 'element-plus'
const deleteOrder = (row) => {
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
            let result = await orderDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            orderList();
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
                <span>订单管理</span>
                <div class="extra">
                    <el-button type="primary" @click="discountAddVisible = true ; clearAddDiscountData()">添加折扣</el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="顾客电话：">
                <el-input v-model="userNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已结付" value="已结付"></el-option>
                    <el-option label="未结付" value="未结付"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="orderList">搜索</el-button>
                <el-button @click="state = '', userNumber ='' ">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="orders" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="订单桌号" prop="createDesk"></el-table-column>
            <el-table-column label="订单状态" prop="state"></el-table-column>
            <el-table-column label="顾客电话" prop="userNumber"></el-table-column>
            <el-table-column label="总价格" prop="price"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button :icon="Coin" circle plain type="primary" @click="showDialogDiscount(row) ; clearFinalData()"></el-button>
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteOrder(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页条 -->
        <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 20]" :page-size="pageSize" :total="total"
            layout="jumper, total, sizes, prev, pager, next" @current-change="onCurrentChange"
            @size-change="onSizeChange" style="margin-top: 20px; justify-content: flex-end">
        </el-pagination>

        <!-- 添加折扣弹窗 -->
        <el-dialog v-model="discountAddVisible" title="添加折扣" width="50%">
            <el-form :model="discountAddModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="顾客电话" prop="userNumber">
                    <el-input v-model="discountAddModel.userNumber" minlength="1" maxlength="12"></el-input>
                </el-form-item>
                <el-form-item label="折扣模式">
                    <el-select placeholder="请选择" v-model="discountAddModel.style">
                        <el-option label="打折" value="打折"></el-option>
                        <el-option label="减免" value="减免"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="折扣额" prop="quota">
                    <el-input v-model="discountAddModel.quota" minlength="1" maxlength="10"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="discountAddVisible = false">取消</el-button>
                    <el-button type="primary" @click="addDiscount()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>


        <!-- 修改订单弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="50%">
            <el-form :model="orderModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="订单桌号" prop="createDesk">
                    <el-input v-model="orderModel.createDesk" minlength="1" maxlength="10" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="顾客电话" prop="userNumber">
                    <el-input v-model="orderModel.userNumber" minlength="1" maxlength="12" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="orderModel.price" minlength="1" maxlength="10" :disabled="true"></el-input>
                </el-form-item>
                <img src="@/assets/pay1.png" alt="微信" style="max-width: 48%;" />
                <img src="@/assets/pay2.png" alt="支付宝" style="max-width: 44%;" />
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加订单' ? addOrder() : updateOrder()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 折扣结账弹窗 -->
        <el-dialog v-model="discountVisible" :title="title" width="30%">
            <el-form :model="discountModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="顾客ID" prop="createCustomer">
                    <el-input v-model="discountModel.createCustomer" minlength="1" maxlength="10" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="顾客电话" prop="userNumber">
                    <el-input v-model="userNumber" minlength="1" maxlength="15" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="选择折扣：">
                    <el-select placeholder="请选择" v-model="quota">
                        <el-option v-for="d in discounts.data" :key="d.quota" :label="`${d.style} _ ${d.quota}`"
                            :value="d.quota">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="确认选择：">
                    <el-select placeholder="确认选择" v-model="discountId">
                        <el-option v-for="d in discounts.data" :key="d.id" :label="`${d.style} _ ${d.quota}`"
                            :value="d.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="discountVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateDiscountAndOrder()"> 确认 </el-button>
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