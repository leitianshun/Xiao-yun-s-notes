import Vue from 'vue'

export default new Vue()



/*
创建一个新的vue实例
在其他组件里使用方法
imporrt Bus from '@/helpers/bus'
Bus.$on('test', msg => {       //监听test事件
    console.log(msg)
})


Bus.$emit('test','hello world')   //触发一个test事件

*/