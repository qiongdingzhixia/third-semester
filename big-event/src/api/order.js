import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//订单查询
export const orderListService = (params)=>{
   return  request.get('/foodorder',{params:params})
}

//订单查询
export const orderIdService = (params)=>{
    return  request.get('/foodorder/detailId',{params:params})
 }

//订单添加
export const orderAddService = (orderData)=>{
    return request.post('/foodorder',orderData);

}

//订单修改
export const orderUpdateService = (orderData) => {
    return request.put('/foodorder', orderData)
}

//订单删除
export const orderDeleteService = (id)=>{
    return request.delete('/foodorder?id='+id)
}