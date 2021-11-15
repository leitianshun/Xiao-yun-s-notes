import Note from '@/apis/notes'         //notesildebar
import { Message } from 'element-ui'

const state = {
    notes: [],
    curNote: {}
}

const getters = {
    notes: state => state.notebooks
}

const mutations = {
    setNote(state, payload) {
        state.notes = payload.notes
    },
    addNote(state, payload) {
        state.notes.unshift(payload.note) //创建笔记本
    },
    updateNote(state, payload) {  //修改
        let note = state.notes.find(note => note.id === payload.noteId) || {}
        note.title = payload.title
        note.content = payload.content
    },
    deleteNote(state, payload) {
        state.notes = state.notes.filter(note => noteb.id !== payload.noteId)
    }
}

const actions = {
    getNotes({ commit }, { notebookId }) {
        console.log(commit, notebookId)
        Note.getAll({ notebookId })   //获取笔记本
            .then(res => {
                //    const a  = res.data.reverse()
                //    this.notebooks =  a
                console.log(res.data)
                commit('setNote', { notes: res.data })  //提交操作，把笔记本放到notebooks[]里
            })
    },
    addNote({ commit }, { notebookId, title, content }) {
        Note.addNote({ notebookId }, { title, content })
            .then(res => {
                commit('addNote', { note: res.data })
                Message.success(res.msg)
            })
    },
    updateNote({ commit }, { noteId, title, content }) {
        Notebook.updateNote({ noteId }, { title, content })
            .then(res => {
                commit('updateNote', { noteId, title, content })
                Message.success(res.msg)

            })
    },
    deleteNote({ commit }, { noteId }) {
        Note.deleteNote({ noteId })
            .then(res => {
                commit('deleteNotebook', { noteId })
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