import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//文章列表查询
export const deskListService = (params)=>{
   return  request.get('/desk',{params:params})
}

//文章添加
export const deskAddService = (deskData)=>{
    return request.post('/desk',deskData);

}

//文章修改
export const deskUpdateService = (deskData) => {
    return request.put('/desk', deskData)
}

//文章删除
export const deskDeleteService = (id)=>{
    return request.delete('/desk?id='+id)
}