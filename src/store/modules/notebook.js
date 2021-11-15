import Notebook from '@/apis/notebooks'         //notebooklist
import {Message} from 'element-ui'

const state = {
  notebooks:null,
  curBookId:null
}

const getters = {
    notebooks:state => state.notebooks  || []  ,
    curBook:state => {
        if(!Array.isArray(state.notebooks))  return {}
        if(!state.curBookId) return state.notebooks[0]
        return state.notebooks.find(notebook => notebook.id == state.curBookId)  ||  {}
    }
}

const mutations = {
    setNotebooks(state,payload) {
     state.notebooks = payload.notebooks   
    },
    addNotebook(state,payload) {
        state.notebooks.unshift(payload.notebook) //创建笔记本
    },
    updateNotebook(state,payload) {  //更新
        let notebook = state.notebooks.find(notebook =>notebook.id == payload.notebookId) || {}
        notebook.title = payload.title
    },
    deleteNotebook(state,payload) {
        state.notebooks = state.notebooks.filter(notebook => notebook.id != payload.notebookId)
    },
    setCurBook(state,payload) {
        state.curBookId = payload.curBookId
    }
}

const actions = {
    getNotebooks({commit}) {
      return  Notebook.getAll()   //获取笔记本
     .then(res => {
        const a  = res.data.reverse()
       this.notebooks =  a
        commit('setNotebooks',{notebooks:a})  //提交操作，把笔记本放到notebooks[]里
     })
    },
    addNotebook({commit},payload) {
      return  Notebook.addNotebook({title:payload.title})
        .then(res => {
            commit('addNotebook',{notebook:res.data})
            Message.success(res.msg)
        })
    },
    updateNotebook({commit},payload) {
      return  Notebook.updateNotebook(payload.notebookId,{title:payload.title})
        .then(res => {
        commit('updateNotebook',{notebookId:payload.notebookId,title:payload.title})
        Message.success(res.msg)

        })
    },
    deleteNotebook({commit},payload) {
      return  Notebook.deleteNotebook(payload.notebookId)
        .then(res => {
          commit('deleteNotebook',{notebookId:payload.notebookId})  
          Message.success(res.msg)

        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}