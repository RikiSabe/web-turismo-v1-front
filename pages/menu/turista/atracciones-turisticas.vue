<template>
  <div class="p-4">
    <Fieldset legend="Atracciones Turisticas">
      <div class="grid grid-cols-3 gap-2">
        <Card v-for="at in AtraccionesTuristicas" :key="at.id" style="overflow: hidden;">
          <template #header>
            <img alt="user header" :src="at.foto" class="h-72 w-full"/>
          </template>
        <template #content>
          <p class="text-xl text-center"> {{ at.nombre }} </p>
          <Divider />
          <div class="flex flex-col items-center">
            <p class="text-sm"> Descripción: {{ at.descripcion }} </p>
            <p class="text-sm"> Dirección: {{ at.direccion }} </p>
          </div>
        </template>
        </Card>
      </div>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { ObtenerAtraccionesTuristicas } from '~/api/atracciones-turisticas'
import { server } from '~/server/server'

definePageMeta({ layout : 'menu-turista' })
const AtraccionesTuristicas = ref<any>([])

onMounted( async () => {
  await obtenerAtraccionesTuristicas()
})

async function obtenerAtraccionesTuristicas() {
  const response:any[] = await $fetch(server.HOST + '/api/v2/atracciones-turisticas/fotos', {
    method: 'GET'
  })
  AtraccionesTuristicas.value = response
}

</script>