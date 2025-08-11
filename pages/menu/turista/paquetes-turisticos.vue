<template>
  <div class="p-2">
    <div class="flex justify-between">
      <InputText type="text-search" placeholder="Buscar paquete turistico" fluid/>
      <Button label="Buscar" icon="pi pi-search" class="ml-2" />
    </div>

    <div class="grid grid-cols-4 gap-2 p-2">
      <Card 
        v-for="paquete in paquetesTuristicos" 
        :key="paquete.nombre" 
        style="overflow: hidden;">
        <template #header>
          <img alt="user header" src="/images/photo_turismo.jpg"/>
        </template>
        <template #title>
          <p class="text-center font-bold"> {{ paquete.nombre }} </p>
        </template>
        <template #content>
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker" />
            <p> Salida:  {{ paquete.salida }} </p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar" />
            <p> {{ paquete.fecha }} </p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-clock" />
            <p> {{ paquete.duracion }} </p>
          </div>
          <Tag 
            v-for="at in paquete.atracciones_turisticas" 
            severity="success" :value="at.nombre" />
          <div class="flex justify-between gap-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-dollar text-green-500" />
              <p class="text-base text-green-500"> {{ paquete.precio }} </p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <Button 
              label="Ver detalles" 
              @click="funcDetallesPaqueteTuristico(paquete.id)" 
              variant="outlined" />
          </div>
        </template>
      </Card>
    </div>
    <DetallesPaqueteTuristico 
      :id="idPaqueteTuristico"
      :open="VisibleDetallesPaqueteTuristico"
      v-if="VisibleDetallesPaqueteTuristico"
      @hidden="VisibleDetallesPaqueteTuristico = false" />

  </div>
</template>

<script lang="ts" setup>
import DetallesPaqueteTuristico from '~/components/turista/paquetes-turisticos/DetallesPaqueteTuristico.vue'
import { server } from '~/server/server'
definePageMeta({ layout: 'menu-turista' })

const VisibleDetallesPaqueteTuristico = ref(false)
const idPaqueteTuristico = ref(0)
const paquetesTuristicos = ref<any[]>([])

onMounted( async () => {
  const response: any[] = await $fetch(server.HOST + '/api/v1/paquetes-turisticos', {
    method: 'GET'
  })
  paquetesTuristicos.value = response
})

const funcDetallesPaqueteTuristico = (id: number)  => {
  idPaqueteTuristico.value = id
  VisibleDetallesPaqueteTuristico.value = true
}
</script>