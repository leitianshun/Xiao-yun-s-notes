<template>
  <div id="login">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="main"></div>
        <div class="form">
          <h3 @click="showRegister">创建账户</h3>
          <transition name="slide">
            <!-- 动态绑定他的class,如果isShowRegister为true，就有show这个class，就展示注册模块 -->
          <div :class="{show:isShowRegister}" class="register">
            <input type="text" placeholder="用户名" v-model="register.username">
            <input type="password" placeholder="密码" v-model="register.password" @keyup.enter="onRegister">
            <p :class="{error:register.isError}">{{register.notice}}</p>
            <div @click="onRegister" class="button">创建账号</div>
          </div>
          </transition>
          <h3 @click="showLogin">登录</h3>
           <transition name="slide">
            <!-- 动态绑定他的class,如果isShowLogi为true，就有show这个class，就展示登录模块 -->
          <div class="login" :class="{show:isShowLogin}">       
            <input type="text" placeholder="输入用户名" v-model="login.username">
            <input type="password" placeholder="密码" v-model="login.password" @keyup.enter="onLogin">
            <p :class="{error:login.isError}">{{login.notice}}</p>  
            <div class="button" @click="onLogin">登录</div>
          </div>
            </transition>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Bus from '@/helpers/bus' //用于传递数据
import Auth from '@/apis/auth'
// Auth.getInfo()
// .then(data => {
//   console.log(data)
// })
// request('/auth')
// .then(data => {
//     console.log(data)
// })

export default {

  data () {
    return {
      isShowLogin:true,
      isShowRegister:false,
      login:{       
        username:'',   //与登录的input输入框绑定
        password:'',
        notice:'输入用户名和密码',   //提示
        isError:false
      },
      register:{  
        username:'',  //与注册的input输入框绑定
        password:'',
        notice:'创建账号后，请记住用户名和密码',
        isError:false
      }
     
    }
  },
  methods:{
      // ...mapActions({
      //   loginUser: 'login',
      //   registerUser: 'register'
      //   }),

    showLogin() {
      this.isShowLogin = true,
      this.isShowRegister = false
    },
    showRegister() {
      this.isShowLogin = false
      this.isShowRegister = true
    },
    onRegister() {                  //test测试，测试注册用户名是否符合规则
      if(!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.register.username)) {  //如果不符合这个规则的，iserror为true，就展示提示
        console.log(this.register.username)//打印出输入的账号，测试是否进入到这个逻辑，并且检测这个正则是否正确/^[\w\u4e00-\u9fa5]{3,15}$/.tset('123')
        this.register.isError = true
        this.register.notice = '用户名为3~15个字符，仅限于字母数字下划线中文'
        return
      }
      if(!/^.{6,16}$/.test(this.register.password)) {
        console.log(this.register.password) //打印出输入的密码，测试是否进入到这个逻辑，并且检测这个正则是否正确/^.{6,16}$/.tset('123456')
        this.register.isError = true
        this.register.notice = '密码长度为6~16个字符'
        return
      }
      
      // console.log(`start register...,username:${this.register.username},password:${this.register.password}`) 
      
    Auth.register({
              username:this.register.username,  //注册
              password:this.register.password
              }).then(() => {
                 this.register.isError = false     //注册信息输入无误后清空错误信息   
                this.register.notice = ''
                Bus.$emit('userInfo',{username:this.login.username})//$emit触发事件
                this.$router.push({path:'notebooks'})   //注册成功后跳转到笔记本列表
               
              }).catch(data => {
                this.register.isError = true       //用户名存在后开启提示
                this.register.notice = data.msg   //提示用户名已存在
              })

    },
    onLogin() {
       if(!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.login.username)) {  //登录
        this.login.isError = true
        this.login.notice = '用户名为3~15个字符，仅限于字母数字下划线中文'
        return
      }
      if(!/^.{6,16}$/.test(this.login.password)) {
        this.login.isError = true
      
        this.login.notice = '密码长度为6~16个字符'
        return
      }
      
     // console.log(`start login..., username: ${this.login.username} , password: ${this.login.password}`)
 
     Auth.login({
        username:this.login.username,    //登录
        password:this.login.password
        }).then(() => {  //登录成功
          this.login.isError = false    //密码输入无误后清空错误信息
          this.login.notice = ''
         Bus.$emit('userInfo',{username:this.login.username})  //触发userInfo事件，当用户登录后传给avtar
          console.log('start redirect ..')
          this.$router.push({ path:'notebooks' }) //登录成功后跳转到笔记本列表
        }).catch(data => {
          this.login.isError = true
          this.login.notice = data.msg //密码错误后提示
        })

    }
  }
}
</script>

<style lang="less" scoped>   
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0,0,.7);
  display: table;   //显示表
  transition: opacity .3 ease; //不透明缓解
}
.modal-wrapper {
  display: table-cell; //显示表格单元
  vertical-align: middle;  //垂直对齐中间
}
.modal-container {
  width: 800px;
  height: 500px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0,0,0,.33);
  transition: all .3 ease;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
}
.main {
  flex: 1;
  background: #36bc64 url(//cloud.hunger-valley.com/17-12-13/38476998.jpg-middle) center center no-repeat;  //居中不重复
  background-size: contain;
}
.form {
  width: 270px;
  border-left: 1px solid #ccc;
  overflow: hidden;  //隐藏溢出
}
h3 {
  padding: 10px 20px;
  margin-top: -1px;
  font-weight: normal;  //字体粗细正常
  font-size: 16px;
  border-top: 1px solid #eee;
  cursor: pointer;
  &:nth-of-type(2){
    border-bottom: 1px solid #eee;
  }
}
.button {
  background-color: #2bb964;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-weight: bold;//字体粗细加粗
  color: #fff;
  border-radius: 4px;
  margin-top: 18px;
  cursor: pointer;
}


.login,.register {
padding: 0px 20px;
border-top: 1px solid #eee;
height: 0;
overflow: hidden;
transition: height .4s;
&.show {
  height: 193px;
}


}
input {
  display: block;
  width: 100%;
  height: 35px;
  line-height: 35px;
  padding: 0 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;  //去掉默认边框
  font-size: 14px;
  margin-top: 10px;
}
input:focus {   //输入框焦点，边框样式
  border: 3px solid #9dcaf8;
}
p {
  font-size: 12px;
  margin-top: 10px;
  color: #444;
}
.error {
  color: red;
}
.login {
  border-top: 0;
}
</style>