<template>
  <div class="p-2">
    <Fieldset legend="Gestion de  Atracciones Turisticas">
      <DataTable 
        :value="AtraccionesTuristicas" 
        showGridlines size="small" 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar atracción..." size="small"/>
            <Button 
              label="Agregar nueva Atraccion" size="small" variant="outlined"
              @click="router.push('/menu/admin/formulario/nueva-atraccion-turistica')" />
              <!-- @click="visibleNuevaAtraccionTuristica = true" /> -->
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
        <!-- <Column header="Categoria">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.categoria }} 
            </span>
          </template>
        </Column> -->
        <Column header="Nombre">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.nombre }} 
            </span>
          </template>
        </Column>
        <Column header="Descripcion">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.descripcion }} 
            </span>
          </template>
        </Column>
        <Column header="Horario Apertura">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.horario_apertura }} 
            </span>
          </template>
        </Column>
        <Column header="Horario Cierre">
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
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <Button 
                icon="pi pi-pencil" type="button" variant="text" 
                @click="funcEditarAtraccionTuristica(slotProps.data.id)" 
                size="small" rounded />
              <Button 
                icon="pi pi-eye" variant="text" severity="contrast" 
                @click="funcDetallesAtraccionTuristica(slotProps.data.id)"
                size="small" rounded />
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

  <div class="p-2">
    <Fieldset legend="Categorias">
      <div class="grid grid-cols-4 gap-2">
        <Card v-for="categoria in Categorias" :key="categoria.id" style="overflow: hidden;">
          <template #header>
            <p class="text-center font-bold mt-3"> {{ categoria.nombre }} </p>
          </template>
          <template #content>
            <p class="text-center text-sm"> {{ categoria.descripcion }} </p>
          </template>
          <!-- <template #footer>
            <div class="flex gap-1">
              <Button 
                label="Editar" variant="outlined" 
                severity="warn" fluid size="small" /> 
              <Button 
                label="subcategorias" fluid variant="outlined"
                @click="router.push('subcategorias')" size="small" />
            </div>
          </template> -->
        </Card>
      </div>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import DetallesAtraccionTuristica from '~/components/admin/atracciones-turisticas/DetallesAtraccionTuristica.vue'
import ModalDetallesEncargado from '~/components/admin/atracciones-turisticas/ModalDetallesEncargado.vue'
import { nombreEstado, colorEstado } from '~/utils/utils'
import { server } from '~/server/server'

const router = useRouter()
definePageMeta({ layout: 'menu-admin' })

const AtraccionesTuristicas = ref<any[]>([])
const Categorias = ref<any[]>([])
// Editar Atraccion Turistica
const VisibleEditarAtraccionTuristica = ref(false)
const id_atraccion = ref(0)

// Detalles Atraccion Turistica
const VisibleDetallesAtraccionTuristica = ref(false)

// Detalles Encargado
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

const funcEditarAtraccionTuristica = (row : any ) => {
  VisibleEditarAtraccionTuristica.value = true
  id_atraccion.value = row
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