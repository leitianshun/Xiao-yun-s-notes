import request from "../helpers/request";
import { friendlyDate } from "../helpers/util";

const URL = {
  GET:'/notebooks',
  ADD:'/notebooks',
  UPDATE:'/notebooks/:id',
  DELETE:'/notebooks/:id'
}
export default {
    getAll() {      //获取所有的笔记本
    return new Promise((resolve,reject) => {
        request(URL.GET)
       .then(res => {
           res.data = res.data.sort((notebook1,notebook2) => notebook1.createdAt > notebook2.createdAt)
           res.data.forEach(notebook => {
               notebook.createdAtFriendly = friendlyDate(notebook.createdAt)
               notebook.updatedAtFriendly = friendlyDate(notebook.updatedAt)
               
           })
          
           resolve(res)
       }).catch(err => {
           reject(err)
       })
    })
    },
    updateNotebook(notebookId,{title = ''} = {title:''}) {  //更新笔记本
        return request(URL.UPDATE.replace(':id',notebookId),'PATCH',{title}) //replace替换，
    },
    deleteNotebook(notebookId) {  //删除笔记本
        return request(URL.DELETE.replace(':id',notebookId),'DELETE')
    },
    addNotebook({title=''} = {title:''}) {  //添加笔记本
        return new Promise((resolve,reject) => {
            request(URL.ADD,'POST',{title}) 
            .then(res => {
                res.data.createdAtFriendly = friendlyDate(res.data.createdAt)
                res.data.updatedAtFriendly = friendlyDate(res.data.updatedAt)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
       
    }
}
