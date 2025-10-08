<template>
  <div class="p-2">
    <Fieldset legend="Reservas">
      <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
        <Card v-for="reserva in Reservas" :key="reserva.id">
          <template #content>
            <p class="flex justify-between gap-2 m-2 p-4"> Descripción:  {{ reserva.descripcion }} </p>
            <div class="flex justify-between gap-2 m-2 p-4">
              <p> Fecha: {{ formatDate(reserva.fecha) }} </p>
              <p> Estado: <Tag :severity="colorEstadoReserva(reserva.estado)" :value="nombreEstadoReserva(reserva.estado)"/> </p> 
            </div>
            <div class="p-4 ring ring-slate-200 rounded-lg m-2">
              <p> Paquete : {{ reserva.paquete.nombre }}</p>
              <p> Descripción : {{ reserva.paquete.descripcion }} </p>
            </div>
          </template>
        </Card>
      </div>
    </Fieldset>
  </div>
</template>

<script lang="ts" setup>
import { server } from '~/server/server'
definePageMeta({ layout: 'menu-turista' }) 

const Reservas = ref<any[]>([])
const id_usuario = ref<Number>(0)

onMounted(async () => {
  id_usuario.value = Number(sessionStorage.getItem('id'))
  if( id_usuario.value == 0 ){
    console.log('id no cargado')
  }
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/reservas/usuario/' + id_usuario.value, {
      method: 'GET'
    })
    Reservas.value = res
    console.log("Reservas cargadas:", JSON.stringify(Reservas.value, null, 2))
  } catch (error) {
    console.error("Error al cargar las reservas:", error)
  }
})

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('es-ES', options)
}
</script>