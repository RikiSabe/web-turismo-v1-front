<template>
  <div class="p-2">
    <Fieldset legend="Gestión de  Atracciones Turísticas">
      <DataTable 
        :value="AtraccionesTuristicas" 
        showGridlines size="small" 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar atracción..." size="small"/>
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay atracciones turisticas</p>
            <div class="flex items-center justify-center">
              <Button 
                icon="pi pi-refresh" rounded 
                size="small" 
                @click="obtenerAtraccionesTuristicas" />
            </div>
          </div>
        </template>
        <Column header="#">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.id }} 
            </span>
          </template>
        </Column>
        <Column header="Nombre">
          <template #body="slotProps">
            <div class="flex justify-between items-center">
              <span class="text-sm"> 
                {{ slotProps.data.nombre }} 
              </span>
              <Button
                v-tooltip.button="{ value : 'Ver Atracción turística' }" 
                icon="pi pi-eye" variant="text" severity="contrast" 
                @click="funcDetallesAtraccionTuristica(slotProps.data.id)"
                size="small" rounded />
            </div>
          </template>
        </Column>
        <Column header="Descripción">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.descripcion }} 
            </span>
          </template>
        </Column>
        <Column header="H. Apertura">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.horario_apertura }} 
            </span>
          </template>
        </Column>
        <Column header="H. Cierre">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.horario_cierre }} 
            </span>
          </template>
        </Column>
        <Column field="precio" header="Precio">
          <template #body="slotProps">
            <p class="text-sm text-end"> 
              {{ slotProps.data.precio }} bs
            </p>
          </template>
        </Column>
        <Column header="Encargado">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <p class="text-sm"> 
                {{  slotProps.data.encargado.nombre_completo   }}
              </p>
              <Button 
                v-tooltip.button.bottom="{ value : 'Ver perfil del encargado' }"
                icon="pi pi-eye" size="small" 
                variant="text" rounded severity="contrast" 
                @click="funcDetallesEncargado(slotProps.data.encargado.id)"/>
            </div>
          </template>
        </Column>
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag 
                :value="nombreEstado(slotProps.data.estado)" 
                :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <ModalDetallesEncargado 
      :id="id_encargado"
      :open="VisibleDetallesEncargado"
      v-if="VisibleDetallesEncargado"
      @close="VisibleDetallesEncargado = false"/>

    <DetallesAtraccionTuristica 
      :id="id_atraccion"
      :open="VisibleDetallesAtraccionTuristica"
      v-if="VisibleDetallesAtraccionTuristica"
      @hidden="VisibleDetallesAtraccionTuristica = false" />

  </div>
</template>

<script setup lang="ts">
import DetallesAtraccionTuristica from '~/components/admin/atracciones-turisticas/DetallesAtraccionTuristica.vue'
import ModalDetallesEncargado from '~/components/admin/atracciones-turisticas/ModalDetallesEncargado.vue'
import { nombreEstado, colorEstado } from '~/utils/utils'
import { server } from '~/server/server'

const router = useRouter()
definePageMeta({ layout: 'menu-encargado-agencia-turismo' })

const AtraccionesTuristicas = ref<any[]>([])
const Categorias = ref<any[]>([])
const id_atraccion = ref(0)
const VisibleDetallesAtraccionTuristica = ref(false)
const VisibleDetallesEncargado = ref(false)
const id_encargado = ref(0)

onMounted( async () => {
  await obtenerAtraccionesTuristicas()
  await obtenerCategorias()
})

async function obtenerAtraccionesTuristicas() {
  try {
    const res:any[] = await $fetch(server.HOST + '/api/v2/atracciones-turisticas',{
      method: 'GET'
    })
    AtraccionesTuristicas.value = res
  } catch ( err ){
    console.error(err)
  }
}

async function obtenerCategorias(){
  try {
    const res:any[] = await $fetch(server.HOST + '/api/v1/categorias', {
      method: 'GET'
    })
    Categorias.value = res
    console.log(JSON.stringify(Categorias.value, null, 2))
  } catch ( err ){
    console.error(err)
  }
}

const funcDetallesAtraccionTuristica = (row : any) => {
  VisibleDetallesAtraccionTuristica.value = true
  id_atraccion.value = row
}

const funcDetallesEncargado = (row: any) => {
  VisibleDetallesEncargado.value = true
  id_encargado.value = row
}
</script>