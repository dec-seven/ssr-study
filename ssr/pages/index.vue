<template>
  <div class="home">
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name:'Home',
  // Nuxt中特殊提供的一个钩子函数，专门用于服务端渲染获取数据
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const { data } = await axios({
      method:'GET',
      url:'http://localhost:3000/data.json'
    })
    return data
  }
}
</script>