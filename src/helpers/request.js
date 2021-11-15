import axios from 'axios'
import {Message} from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'https://note-server.hunger-valley.com'  //http后加s
axios.defaults.withCredentials = true //表示是否使用跨域请求

export default function request(url, type = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        let option = {
            url,
            method: type,

            validateStatus(status) {
                return (status >= 200 && status < 300) || status === 400      //状态码等于200-400时进入resolve，错误了直接reject
            }
        }
        if (type.toLowerCase() === 'get') {
            option.params = data
        } else {
            option.data = data
        }
        axios(option).then(res => {
            console.log(res)
            if (res.status === 200) {

                resolve(res.data)
            } else {
                Message.error(res.data.msg)
                reject(res.data)
            }
        }).catch(err => {
            console.log(err)
           Message.error('网络异常')
            reject({msg:'网络异常'})
        })
    })
}








// request('/auth/login','POST',{username:'hunger',password:'123456'})
// .then(data => {
//     console.log(data)
// })