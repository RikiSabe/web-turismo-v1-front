<template>
  <div class="p-2">
    <Fieldset legend="Reservas">
      <div class="grid grid-cols-3 gap-2">
        <Card v-for="reserva in Reservas" :key="reserva.id">
          <template #header>
            <img alt="user header" src="/images/photo_turismo.jpg"/>
          </template>
          <template #content>
            <p> Descripción:  {{ reserva.descripcion }} </p>
            <p> Fecha: {{ formatDate(reserva.fecha) }} </p>
            <p> Estado: <Tag :severity="funcSeverity(reserva.estado)" :value="funcEstado(reserva.estado)"/> </p> 
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

function funcEstado(estado: any) {
  if( estado == true ){
    return 'Confirmado'
  } else {
    return 'Pendiente'
  }
}

function funcSeverity(estado: any) {
  if( estado == true){
    return 'success'
  } else {
    return 'warn'
  }
}

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('es-ES', options)
}
</script>