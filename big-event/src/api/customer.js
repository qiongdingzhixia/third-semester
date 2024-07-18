import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'



//顾客添加
export const customerAddService = (customerData)=>{
    return request.post('/customer',customerData);

}

//顾客查询
export const customerFindService = (params)=>{
    return request.get('/customer',{params:params});

}
