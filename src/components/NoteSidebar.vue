<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="onAddNote">添加笔记</span>
    <!-- placement="bottom"  菜单提示在底部 -->
    <pre>{{ JSON.stringify(notes, null, 2) }}</pre>
    <el-dropdown
      @command="handleCommand"
      class="notebook-title"
      placement="bottom"
    >
      <span class="el-dropdown-link">
        {{ curBook.title }}<i class="iconfont icon-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="notebook in notebooks"
          :command="notebook.id"
          :key="notebook.id"
        >
          {{ notebook.title }}</el-dropdown-item
        >
        <el-dropdown-item command="trash">回收站</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="notes">
      <li v-for="note in notes" :key="note.id">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="data">{{ note.updatedAtFriendly }}</span>
          <span class="title">{{ note.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Notebooks from "@/apis/notebooks";
import Bus from "@/helpers/bus";
import Notes from "@/apis/notes";
//window.Notes = Notes  //测试接口,添加笔记
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  created() {
    this.getNotebooks().then(() => {
      this.$store.commit("setCurBook", {
        curBookId: this.$route.query.notebookId,
      });
      this.getNotes({ notebookId: this.curBook.id }).then(() => {console.log(this.notes)});
    });

    //   Notebooks.getAll() //获取笔记本列表
    //   .then(res => {
    // this.notebooks =  res.data
    // this.curBook = this.notebooks.find(notebook => notebook.id == this.$route.query.notebookId)
    //   || this.notebooks[0] || {}
    //   return Notes.getAll({notebookId: this.curBook.id})

    //   }).then(res => {
    //     this.notes = res.data
    //     this.$emit('update:notes',this.notes) //触发事件
    //   Bus.$emit('update:notes',this.notes)
    //   })
  },

  computed: {
    ...mapGetters(["notebooks", "curBook", "notes"]),
  },
  methods: {
    ...mapActions(["getNotebooks", "getNotes", "addNote"]),

    handleCommand(notebookId) {
      if (notebookId == "trash") {
        return this.$router.push({ path: "/trash" }); //跳转到回收站
      }
      this.$store.commit("setCurBook", { curBookId: notebookId });
      this.getNotes({ notebookId });

      //this.curBook = this.notebooks.find(notebook => notebook.id == notebookId)

      // this.curBook = this.notebooks.find(notebook => notebook.id == notebookId) //菜单中的笔记赋值给curBook
      //    Notes.getAll({notebookId})
      //  .then(res => {
      //    const a  = res.data.reverse()//时间排序
      //   this.notes =  a
      //   this.$emit('update:notes',this.notes) //告诉父组件(<note-sidebar>)更新事件
      //   //  this.notes = res.data
      // })
    },
    onAddNote() {
      //创建笔记本
      this.addNote({ notebookId: this.curBook.id }); //创建一个空的笔记，标题内容可以编辑
      //   .then(res => {
      //     console.log(res)
      //     //this.notes = res.data.reverse()
      //     this.notes.unshift(res.data)  //把创建的笔记放到列表里
      //   })
    },
  },
};
</script>

<style lang="less" scoped>
.note-sidebar {
  position: relative;
  width: 300px;
  border-right: 1px solid #ccc;
  background-color: #eee;

  .add-note {
    position: absolute;
    right: 5px;
    top: 12px;
    color: #666;
    font-size: 12px;
    padding: 2px 4px;
    box-shadow: 0px 0px 2px 0px #ccc;
    border: none;
    z-index: 1;
  }

  .notebook-title {
    font-size: 18px;
    font-weight: normal;
    color: #333;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    background-color: #f7f7f7;
    display: block;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-dropdown-menu__item {
    width: 200px;
  }

  .menu {
    display: flex;

    div {
      font-size: 12px;
      padding: 2px 10px;
      flex: 1;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;

      &:last-child {
        border-right: none;
      }
    }

    .iconfont {
      font-size: 10px;
    }
  }

  .notes {
    li {
      &:nth-child(odd) {
        background-color: #f2f2f2;
      }

      a {
        display: flex;
        padding: 3px 0;
        font-size: 12px;
        border: 2px solid transparent;
      }

      .router-link-exact-active {
        border: 2px solid #81c0f3;
        border-radius: 3px;
      }

      span {
        padding: 0 10px;
        flex: 1;
      }
    }
  }
}
</style>


添加笔记
 Notes.addNote({notebookId:3561},{title:'sdds',content:'888'})
 .then(res => {
   console.log(res)
 })


//Notes.getAll({notebookId:3550}).then(res => {console.log(res)})