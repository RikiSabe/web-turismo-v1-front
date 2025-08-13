<template>
  <Dialog v-model:visible="Visible" modal header="Decisión de la reserva" :style="{ width: '25rem' }">
    <span> Decida de forma basica la reservacion de la reserva: </span>
    <span> {{ initialValues.nombre }} </span>
    <Select 
      :options="Estados" option-value="valor" option-label="nombre" 
      v-model="initialValues.estado"
      fluid size="small" />

    <template #footer>
      <Button 
        label="Confirmar Decisión" 
        @click="handleDecision()" 
        fluid size="small" />
      <Button 
        label="Cancelar" 
        @click="Visible = false" 
        severity="danger" 
        fluid size="small" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { server } from '~/server/server';

interface Props{ id: number, open:boolean }
const props = defineProps<Props>()
const emit = defineEmits(['update', 'close', 'fail'])

const Visible = ref(props.open)

watch((Visible), newValue => {
  if( !newValue ) {
    emit('close')
  }
})

const initialValues = reactive({
  nombre: '',
  estado: false
})

const Estados = [
  {
    nombre: 'Pendiente',
    valor: false
  },
  {
    nombre: 'Confirmado',
    valor: true
  }
]

onMounted( async () => {
  await obtenerReserva()
})

const obtenerReserva = async () => {
  try {
    const res:any = await $fetch(server.HOST + '/api/v1/reservas/' + props.id, {
      method: 'GET'
    })
    initialValues.nombre = res.nombre
    initialValues.estado = res.estado
  } catch (error) {
    console.log(error)
  }
}

const handleDecision = async () => {
  console.log(initialValues.estado)
  try {
    await $fetch(server.HOST + '/api/v1/reservas/decision/' + props.id, {
      method: 'POST',
      body: {
        estado: initialValues.estado
      }
    })
    Visible.value = false
    emit('update'), emit('close')
  } catch (error) {
    console.log(error)
  }
}

</script>