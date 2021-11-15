import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'                      /*引入components目录下的Login*/
import NotebookList from '@/components/NotebookList'
import NoteDetail from '@/components/NoteDetail'
import TrashDetail from '@/components/TrashDetail'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },

    {                                            
     path: '/login',                     
                   /*引入一个路由后，需要添加属性*/
     component: Login           
   },
   {
     path:'/notebooks',
     component:NotebookList
   },
   {
    path:'/note',             /*加上/:noteId，表示hash对应的id*/
    component:NoteDetail
  },
  {
    path:'/trash',
    component:TrashDetail
  }

  ]
})
