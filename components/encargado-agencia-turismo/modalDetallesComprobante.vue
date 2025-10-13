<template>
  <Dialog v-model:visible="visible" modal header="Comprobante de Pago" :style="{ width: '40rem' }">
    <p>el comprobante de pago</p>
  </Dialog>
</template>

<script setup lang="ts">
interface Props {
  id_reserva: number
  id_usuario: number
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const visible = ref(props.open)

watch(visible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

</script>