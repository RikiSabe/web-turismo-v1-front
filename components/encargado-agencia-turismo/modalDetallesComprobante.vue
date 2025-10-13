<template>
  <Dialog v-model:visible="visible" modal header="Comprobante de Pago" :style="{ width: '40rem' }">
    <img v-if="Comprobante" :src="Comprobante" alt="Comprobante de Pago" class="w-full h-auto" />
    <p v-else class="text-center">No hay comprobante disponible.</p>
  </Dialog>
</template>

<script setup lang="ts">
import { server } from '~/server/server';

interface Props {
  id_reserva: number
  id_usuario: number
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const visible = ref(props.open)
const Comprobante = ref<string>('N/A')

watch(visible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

onMounted( async () => {
  await ObtenerComprobante()
})

async function ObtenerComprobante() {
  try {
    const response:any = await $fetch(server.HOST + '/api/v1/pagos/comprobante/' + props.id_usuario + '/' + props.id_reserva, {
      method: 'GET',
    })
    Comprobante.value = response.foto
  } catch (error) {
    console.error('Error al obtener el comprobante:', error)
  }
}
</script>