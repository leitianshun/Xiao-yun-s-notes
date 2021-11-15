<template>
  <span :title="username">{{slug}}</span>
</template>

<script>
import Auth from '../apis/auth'
import Bus from '@/helpers/bus'
export default {
name: 'Avatar',
  data () {
    return {       
            username:'未登录', 
    }
  },
  created() {
    Bus.$on('userInfo', user => {   //监听$emit事件，把登录后的username传递过来
      this.username = user.username

    })
    Auth.getInfo()
    .then(res => {
      if(res.isLogin) {
        this.username = res.data.username
      }
    })
  },
  computed: {

    slug() {
      return this.username[0] 
    }
  }
}
</script>

<style  scoped>
span {
    display: inline-block;
    width: 30px;
    text-align: center;
    cursor: pointer;
    line-height: 32px;
    border-radius: 50%;
    background:#1be71b;
    color: #fff;
    text-shadow: 1px 1px 1px #795c19;   /*阴影，有四个参数，分别代表x轴和y轴，以及模糊距离，颜色*/
    font-weight: bold;  /*字体加粗*/
    margin-top: 10px;
    text-transform: uppercase;  /*转换成大写*/
    font-size: 18px;
}
</style>

