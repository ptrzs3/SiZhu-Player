<script setup lang="ts">
import btn from './components/play.vue'
</script>

<template>
  <h1>Hello, this is SiZhu Player</h1>
  <audio src="sizhu:///Users/zhangsan/qingyijie.mp3" controls></audio>
  <v-btn icon="$vuetify"> Button </v-btn>
  <btn></btn>
</template>
