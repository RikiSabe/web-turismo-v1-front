<template>
  <Toast />
  <div class="p-2">
    <div class="flex justify-end gap-2">
      <InputText type="text-search" placeholder="Buscar paquete turistico" size="small"/>
      <Button label="Buscar" icon="pi pi-search" class="ml-2" size="small" />
    </div>

    <Fieldset legend="Paquetes Turisticos">
      <div class="grid grid-cols-3 gap-2 p-2">
      <Card 
          v-for="paquete in paquetesTuristicos" 
          :key="paquete.nombre" 
          style="overflow: hidden;">
          <template #header>
            <img alt="user header" :src="paquete.atracciones[0].foto" class="w-full" />
          </template>
          <template #title>
            <p class="text-center font-bold"> 
              {{ paquete.nombre }} 
            </p>
          </template>
          <template #content>
            <div class="flex flex-col gap-2 p-4">
              <p class="text-sm">
                {{ paquete.descripcion }} 
              </p>
              <p class="text-sm"> Tipo: {{ paquete.tipo }} </p>
              <div class="text-sm" v-if="paquete.tipo === 'Días concurrentes'">
                <div class="grid grid-cols-3 gap-2">
                  <Tag v-for="vigencia in paquete.vigencias" :key="vigencia.id" :value="diaSemana(vigencia.id_dia)"/>
                </div>
              </div>
              <div class="text-sm" v-if="paquete.tipo === 'Rango de días especificos'">
                <p> de {{ formatearFecha(paquete.vigencias[0].fecha_inicio) }} a {{ formatearFecha(paquete.vigencias[0].fecha_fin) }} </p>
              </div>
              <div class="text-sm" v-if="paquete.tipo === 'Único día'">
                <p> solo el {{ formatearFecha(paquete.vigencias[0].fechaunica) }} </p>
              </div>
            </div>
            <div class="flex justify-end gap-2 p-2">
              <div class="flex items-center gap-2">
                <i class="pi pi-dollar text-green-500" />
                <p class="text-sm font-bold font-serif text-green-500"> 
                  {{ paquete.precio }} 
                </p>
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
    </Fieldset>
    <DetallesPaqueteTuristico
      :id="idPaqueteTuristico"
      :open="VisibleDetallesPaqueteTuristico"
      v-if="VisibleDetallesPaqueteTuristico"
      @confirm="toast.add({detail: 'Paquete reservado Existosamente, revise su bandeja de reservas', severity: 'success', life: 3000})"
      @hidden="VisibleDetallesPaqueteTuristico = false" />
  </div>
</template>

<script lang="ts" setup>
import DetallesPaqueteTuristico from '~/components/turista/paquetes-turisticos/DetallesPaqueteTuristico.vue'
import { diaSemana } from '~/utils/utils'
import { server } from '~/server/server'
definePageMeta({ layout: 'menu-turista' })

const toast = useToast()
const VisibleDetallesPaqueteTuristico = ref(false)
const idPaqueteTuristico = ref(0)
const paquetesTuristicos = ref<any[]>([])

onMounted( async () => {
  const response: any[] = await $fetch(server.HOST + '/api/v1/paquetes-turisticos/foto', {
    method: 'GET'
  })
  paquetesTuristicos.value = response
  console.log(JSON.stringify(paquetesTuristicos.value, null, 2))
})

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const funcDetallesPaqueteTuristico = (id: number)  => {
  idPaqueteTuristico.value = id
  VisibleDetallesPaqueteTuristico.value = true
}
</script>