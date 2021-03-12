import axios from 'axios'
import { message } from 'ant-design-vue'
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})
// 设置post请求数据类型
// instance.defaults.headers.post['content-type'] = 'application/json;charset=UTF-8'

// 请求拦截
instance.interceptors.request.use(option => {
  return option
}, error => {
  console.log('请求没有发出去', error)
})

// 响应拦截
instance.interceptors.response.use(option => {
  const { status, data } = option
  // 状态码200 代表服务端已响应
  if (status === 200) {
    const { code } = data
    // 与后端协商的业务code码
    if (code !== 200) {
      message.warning(data.message)
      return
    }
    return Promise.resolve(option)
  }
}, error => {
  const { status } = error.response
  switch (status) {
    case 500 :
      // message.error('服务端发生错误，请稍后重试')
      break
    case 404 :
      // message.error('当前请求的资源不存在！')
      break
  }
  // 响应失败
  console.log('响应失败', error)
})
export default instance
