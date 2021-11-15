<template>
<div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i> 新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{notebooks.length}})</h3>
        <div class="book-list">
      <router-link v-for="notebook in notebooks" :to="`/note?notebookId=${notebook.id}`" class="notebook"  :key="notebook.id"> 
            <div>
              <span class="iconfont icon-notebook">{{notebook.title}}   {{notebook.noteCounts}}</span> 
            
                 <!-- stop阻止事件传播，prevent阻止默认事件 -->
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>  
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>  
              <span class="date">{{notebook.friendlyCreatedAt}}</span>              
            </div>
           </router-link>           
        </div>       
      </div>

    </main>

  </div>
</template>

<script>

import Auth from '@/apis/auth'
import Notebooks from '@/apis/notebooks'
import { friendlyDate } from '@/helpers/util'
import { mapState, mapActions, mapGetters} from 'vuex'

export default {
 
  data () {
    return {
      // notebooks:[] //笔记本列表所有的数据
      
    }
  },

  created() {   //生命周期钩子，异步请求适合调用
    Auth.getInfo()   //获取用户信息
    .then(res => {
      if(!res.isLogin) {   //如果用户未登录时无法访问该页面，跳转到登录页面
        this.$router.push({path:'/login'})
      }
      
    })
    // Notebooks.getAll()   //获取笔记本
    // .then(res => {
      // const a  = res.data.reverse()
      // this.notebooks =  a
      //console.log(this.notebooks)//
    // })
     this.$store.dispatch('getNotebooks')  //调用actions里的方法,来获取笔记本
  
  }, 
  computed:{
    ...mapGetters(['notebooks'])
  },
    
  methods:{
   ...mapActions([  //拿到actions中的方法
    'getNotebooks',
    'addNotebook',
    'updateNotebook',
    'deleteNotebook'
   ]),


    onCreate() {
      this.$prompt('请输入新笔记本标题', '创建笔记本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: '笔记本标题不能为空，且不能超过30个字符'
        }).then(({ value }) => {
          this.addNotebook({title:value})
       // return Notebooks.addNotebook({title:value})

      })
    //  .then(res => {
        
      //   res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
      //   this.notebooks.unshift(res.data) //把新建的笔记放在前面
      // this.$message({
      //       type: 'success',  //创建成功后弹出提示
      //       message:res.msg
      //     })
      // })
        // .catch((res) => {
        //  this.$message({
          //  type:'error',
          //  messag:res.msg

        //  })       
        // })
    },



    onEdit(notebook) {
      let title =''
         this.$prompt('请输入新笔记本标题', '修改笔记本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,30}$/,
          inputValue:notebook.title,   //显示修改前的初始值初始值
          inputErrorMessage: '笔记本标题不能为空，且不能超过30个字符'
        }).then(({ value }) => {
          title = value
        this.updateNotebook({notebookId:notebook.id, title:title})
       // return Notebooks.updateNotebook(notebook.id, {title})

        })
        // .then(res => {
        //  notebook.title = title
        // res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
        // this.notebooks.unshift(res.data) //把新建的笔记放在前面
      // this.$message({
      //       type: 'success',
      //       message:res.msg
      //     })
      // })
      //   .catch((res) => {
      //    this.$message({
          //  type:'error',
          //  messag:res.msg
        //    type: 'info',
        //     message: '已取消编辑'
        //  })       
        // })





    //  let title = window.prompt('修改标题',notebook.title) //第二个参数表示展示之前的笔记本标题
    //  Notebooks.updateNotebook(notebook.id,{ title })
    //  .then(res => {
    //    console.log(res)
    //    notebook.title = title
    //    alert(res.msg)
    //  })
    },



    onDelete(notebook) {  //删除笔记本
      this.$confirm('此操作将会删除笔记本, 是否继续?', '删除笔记本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNotebook({notebookId:notebook.id})
        })
        
      //   .then(res => {
      // this.notebooks.splice(this.notebooks.indexOf(notebook),1)
      // //this.notebooks.splice(this.notebooks.indexOf(notebook),1)
      // this.$message({
      //   type:'success',
      //   message:res.msg
      //     // message:'删除成功了'
      // })
      //   }).catch(res => {
      //     this.$message({
      //   // type:'error',
      //   // messag:res.msg
      //   type: 'info',
      //       message: '已取消删除'
      //   })
      // })





    //  let isConfirm = window.confirm('确认删除吗？')
    //  if(isConfirm) {
    //    Notebooks.deleteNotebook(notebook.id)
    //    .then(res => {
    //      console.log(res)
    //      this.notebooks.splice(this.notebooks.indexOf(notebook),1)
    //      alert(res.msg)
    //    })
    //  }
    }
  }
}
</script>

<style lang="less" scoped>
@import  url(../assets/css/notebook-list.less);
</style>