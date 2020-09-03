import Vue from 'vue'
import axios from 'axios'

const HttpClient = axios.create({
  baseURL: 'http://62cb40c835bc.ngrok.io'
  // baseURL: 'http://localhost:3333'
})

HttpClient.interceptors.request.use(config => {
  const token = localStorage.getItem('appgerencial_token')

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
}, response => Promise.reject(response))

Vue.prototype.$axios = HttpClient
