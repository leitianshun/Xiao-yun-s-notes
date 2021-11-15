<template>
<div id="note" class="detail">   
    <!--  父组件监听子组件更新的事件   -->
   <note-sidebar  @update:notes = "val => notes = val"></note-sidebar>
  <div  class="note-detail">
    <!-- 如果没有curnote.id，就表示cueNote是空对象，就展示“请选择笔记” -->
      <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
       <div class="note-bar">
  <span >创建日期: {{curNote.createdAtFriendly}} </span>
  <span>更新日期:{{curNote.updatedAtFriendly}}  </span>
  <span>{{statusText}}</span>
  <span class="iconfont icon-delete"  @click="deleteNote"></span>
  <span class="iconfont icon-fullscreen"  @click="isShowPreview=!isShowPreview"></span>

</div>

<div class="note-title">
         <!--v-model双向绑定， value与title绑定，输入value的值就等于标题 。  @keydown="statusText='正在输入....'"  输入时显示正在输入  -->
  <input type="text" v-model:value="curNote.title" @input="updateNote" @keydown="statusText='正在输入....'"  placeholder="输入笔记本标题">  
</div>
<div class="editor">
       <!-- value与content绑定，输入value的值就等于内容 -->
  <textarea v-show="!isShowPreview"  v-model:value="curNote.content"  @input="updateNote" @keydown="statusText='正在输入....'"   placeholder="输入内容，支持 markdown 语法" ></textarea>
  <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview"></div>
</div>
  </div>

      </div>

  </div>
</template>

<script>
import Auth from '@/apis/auth'
import NoteSidebar from './NoteSidebar.vue'
import Bus from '@/helpers/bus'
import _ from 'lodash'  //节流
import Notes from '@/apis/notes'  //用于发送请求，更新内容
import MarkdownIt from 'markdown-it'  //引入markdown，用于解析成html
let md = new MarkdownIt()

 
export default {
  components: { NoteSidebar },
 
  data () {
    return {  
     curNote:{   //curNote里的数据来源于notes
         },
     notes:[],  //子组件的信息已经传递过来，子组件sildebar组件的笔记列表
     statusText:'笔记未改动',  //保存状态
     isShowPreview:false
    }
  },

  created() {
    Auth.getInfo()   //获取信息
    .then(res => {
      if(!res.isLogin) {  //isLogin为false，表示用户未登录，则跳转到登录页面，push可以返回,replace不可以
        this.$router.push({path:'/login'})  
      }
    })
    Bus.$once('update:notes',val => {  //oncee只监听一次
      this.curNote = val.find(note => note.id == this.$route.query.noteId) || {}  //监听sildbar组件
    })
  },

computed:{
  previewContent() {
    return md.render(this.curNote.content || '')  //markdown解析成html,默认空字符串
  }
},


  beforeRouteUpdate (to, from, next) {  //路由更新时触发
     console.log('beforeRouteUpdate')
     console.log(to, from)

    this.curNote = this.notes.find( note => note.id == to.query.noteId) 
    next()
  },

  methods:{  //@input="updateNote" 的方法
    updateNote:_.debounce(function() { //节流
   Notes.updateNote({noteId:this.curNote.id},{title:this.curNote.title,content:this.curNote.content}) //发送请求并更新输入的数据
   .then(data => {
     this.statusText = '已保存'  //内容更新成功后显示
     
     }) .catch(data => {
       this.statusText = '保存出错'  //内容更新失败后显示
       console.log('error',data)
   })
    },300), //300毫秒内有输入就合并为一次,停下就会保存

    deleteNote() {  //删除的方法
    Notes.deleteNote({noteId:this.curNote.id})
    .then(data => {
      this.$message.success(data.msg)
      this.notes.splice(this.notes.indexOf(this.curNote),1) //删除notesildebar笔记列表里的笔记
      this.$router.replace({path:'/note'})  //删除后跳转到note，不会返回
    })
    }
 

  }
}
</script>

<style lang="less" scoped>
#note {
  display: flex;
  align-items: stretch; //对齐项目:拉伸
  background-color: #fff;
  flex: 1;
}


.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;  //方向，按列排

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-bar {
    padding: 10px 30px;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    margin-right: 5px;
    &:after {
      content:'';
      display: block;
     
      clear: both;
    }
    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }
    .iconfont{
      float: right;
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }

  }

  .note-title{
    input,span {
      display: inline-block;
      width: 100%;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 10px 20px;
    }
  }

  .editor {
    height: ~"calc(100% - 70px)";
    position: relative;

    .vue-codemirror {
      height: ~"calc(100% - 25px)";

      .CodeMirror {
        height: 100%;
        padding: 10px;
      }
    }

  }
  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  code {
    color: #f66;
  }
}  
</style>