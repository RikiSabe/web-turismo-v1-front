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
            <p> Estado: <Tag severity="warn" value="pendiente"/> </p> 
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

  onMounted(async () => {
    try {
      const id_usuario = await localStorage.getItem('id')
      const res: any = await $fetch(server.HOST + '/api/v1/reservas/usuario/1', {
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