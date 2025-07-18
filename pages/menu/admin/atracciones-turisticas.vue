<template>
  <div class="p-2">
    <Toast />
    <Fieldset legend="Gestion de  Atracciones Turisticas">
      <DataTable :value="AtraccionesTuristicas" showGridlines size="small" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar atraccion..." size="small"/>
            <Button 
              label="Agregar nueva Atraccion" size="small" 
              @click="visibleNuevaAtraccionTuristica = true" variant="outlined"/>
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay atracciones turisticas</p>
            <div class="flex items-center justify-center">
              <Button icon="pi pi-refresh" rounded size="small" @click="funcObtenerAtraccionesTuristicas" />
            </div>
          </div>
        </template>
        <Column field="id" header="#" />
        <Column field="tipo" header="Tipo" />
        <Column field="nombre" header="Nombre" />
        <Column field="ubicacion" header="Ubicacion" />
        <Column field="precio" header="Precio">
          <template #body="slotProps">
            <p class="text-end"> {{ slotProps.data.precio }} bs</p>
          </template>
        </Column>
        <Column field="horarios" header="Horario" />
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag :value="nombreEstado(slotProps.data.estado)" :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <!-- <Button icon="pi pi-trash" variant="text" severity="warn"/> -->
              <Button icon="pi pi-pencil" type="button" variant="text" @click="funcEditarAtraccionTuristica(slotProps.data.id)" />
              <Button icon="pi pi-eye" variant="text" severity="contrast" @click="funcDetallesAtraccionTuristica(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <EditarAtraccionTuristica
      :id="id_atraccion"
      :open="VisibleEditarAtraccionTuristica"
      v-if="VisibleEditarAtraccionTuristica"
      @hidden="VisibleEditarAtraccionTuristica = false"
      @refreshList="funcObtenerAtraccionesTuristicas"
      @modified="funcAtraccionTuristicaEditada" />

    <DetallesAtraccionTuristica 
      :id="id_atraccion"
      :open="VisibleDetallesAtraccionTuristica"
      v-if="VisibleDetallesAtraccionTuristica"
      @hidden="VisibleDetallesAtraccionTuristica = false" />

    <ModalAgregarAtraccionTuristica 
      :open="visibleNuevaAtraccionTuristica"
      v-if="visibleNuevaAtraccionTuristica"
      @close="visibleNuevaAtraccionTuristica = false"/>
  </div>
</template>

<script setup lang="ts">
import { ObtenerAtraccionesTuristicas } from '~/api/atracciones-turisticas'
import ModalAgregarAtraccionTuristica from '~/components/admin/atracciones-turisticas/ModalAgregarAtraccionTuristica.vue'
import EditarAtraccionTuristica from '~/components/admin/atracciones-turisticas/ModalEditarAtraccionTuristica.vue'
import DetallesAtraccionTuristica from '~/components/admin/atracciones-turisticas/DetallesAtraccionTuristica.vue'
definePageMeta({ layout: 'menu-admin' })

const AtraccionesTuristicas = ref<any>([])
const visibleNuevaAtraccionTuristica = ref(false)

const toast = useToast()

// Editar Atraccion Turistica
const VisibleEditarAtraccionTuristica = ref(false)
const id_atraccion = ref(0)

// Detalles Atraccion Turistica
const VisibleDetallesAtraccionTuristica = ref(false)

const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

onMounted( async () => {
  funcObtenerAtraccionesTuristicas()
})

async function funcObtenerAtraccionesTuristicas() {
  AtraccionesTuristicas.value = await ObtenerAtraccionesTuristicas()
}

const funcEditarAtraccionTuristica = (row : any ) => {
  VisibleEditarAtraccionTuristica.value = true
  id_atraccion.value = row
}

const funcAtraccionTuristicaEditada = () => {
  toast.add({
    severity: 'success',
    summary: 'Atraccion Turistica modificada',
    detail: 'Los datos se actualizaron correctamente.',
    life: 3000,
  })
}

const funcDetallesAtraccionTuristica = (row : any) => {
  VisibleDetallesAtraccionTuristica.value = true
  id_atraccion.value = row
}
</script>