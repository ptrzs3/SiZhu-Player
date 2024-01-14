<script setup lang="ts">
import { ref } from 'vue'

const aa = ref('plebeia://C:/Users/ptrzs/Desktop/dir1/爱情错觉 - 王娅.mp3')
async function next() {
  aa.value = await window.api.newsong()
  console.log(aa.value)
}
</script>

<template>
  <h1>Hello, here is Plebeia, means '雪见' in Chinese</h1>
  <audio :src="aa" type="audio/mpeg" controls autoplay></audio>
  <v-btn icon="$vuetify" @click="next"> Button </v-btn>
</template>
