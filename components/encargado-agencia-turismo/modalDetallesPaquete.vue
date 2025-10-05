<template>
  <Dialog v-model:visible="visible" modal maximizable header="Detalles del Paquete Turístico">

  </Dialog>
</template>

<script setup lang="ts">
interface Props { open: boolean, id: number }

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const visible = ref(props.open)

</script>