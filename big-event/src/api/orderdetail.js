import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//订单详情查询
export const orderdetailListService = (params)=>{
   return  request.get('/foodorderdetail',{params:params})
}

//订单详情添加
export const orderdetailAddService = (orderdetailData)=>{
    return request.post('/foodorderdetail',orderdetailData);

}

//订单详情修改
export const orderdetailUpdateService = (orderdetailData) => {
    return request.put('/foodorderdetail', orderdetailData)
}

//文章详情删除
export const orderdetailDeleteService = (id)=>{
    return request.delete('/foodorderdetail?id='+id)
}