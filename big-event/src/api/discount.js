import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//折扣查询
export const discountListService = (params)=>{
   return  request.get('/discount',{params:params})
}

//添加折扣
export const discountAddService = (discountData)=>{
    return request.post('/discount',discountData);

}

//删除折扣
export const discountDeleteService = (id)=>{
    return request.delete('/discount?id='+id)
}