<template>
  <Inicio />  
</template>

<script setup lang="ts">
  import Inicio from './inicio.vue'
  definePageMeta({ layout: 'menu' })
  const router = useRouter()
  router.push('/inicio')
</script>