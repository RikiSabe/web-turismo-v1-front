<template>
  <div class="p-2">
    <Toast />
    <Fieldset legend="Gestion de Agencias" >
      <DataTable 
        :value="Agencias" showGridlines size="small" 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <p class="text-center"> No hay Agencias </p>
        </template>
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar agencia..." size="small"/>
            <Button 
              label="Agregar nueva Agencia" variant="outlined" size="small" 
              @click="visibleNuevaAgencia  = true" />
          </div>
        </template>
        <Column header="#">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.id }} </span>
          </template>
        </Column>
        <Column header="Nombre">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.nombre }} </span>
          </template>
        </Column>
        <Column header="Direccion">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.direccion }} </span>
          </template>
        </Column>
        <Column header="Telefono">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.telefono }} </span>
          </template>
        </Column>
        <Column header="Correo Electronico">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.correo }} </span>
          </template>
        </Column>
        <Column header="Estado">
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
                icon="pi pi-pencil" variant="text" 
                @click="funcEditarAgencia(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <ModalEditarAgencia
      :id="id_agencia"
      :open="visibleEditarAgencia"
      v-if="visibleEditarAgencia"
      @hidden="visibleEditarAgencia = false"
      @refreshList="funcObtenerAgencias"
      @modified="
        toast.add({
          severity: 'success',
          summary: 'Usuario modificado',
          detail: 'Los datos se actualizaron correctamente.',
          life: 3000,
        })" 
        @error="
        toast.add({
          severity: 'danger',
          summary: 'Usuario No Modificado',
          detail: 'Los datos no pudieron actualizarse',
          life: 3000,
        })"/>

    <ModalAgregarAgencia
      :open="visibleNuevaAgencia"
      v-if="visibleNuevaAgencia"
      @hidden="visibleNuevaAgencia = false"
      @refreshList="funcObtenerAgencias"
      @addedCorrect="funcAgenciaAgregadaCorrecta"
      @addedFail="funcAgenciaAgregadaFallada" />
  </div>
</template>

<script setup lang="ts">
import { ObtenerAgencias } from '~/api/agencias'
import ModalEditarAgencia from '~/components/admin/agencias/ModalEditarAgencia.vue'
import ModalAgregarAgencia from '~/components/admin/agencias/ModalAgregarAgencia.vue'
definePageMeta({ layout: 'menu-admin'})

const Agencias = ref<any>([])
const visibleNuevaAgencia = ref(false)
const visibleEditarAgencia = ref(false)
const visibleDetalleAgencia = ref(false)
const id_agencia = ref(0)
const toast = useToast()

const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

onMounted( async () => {
  funcObtenerAgencias()
})

async function funcObtenerAgencias() {
  Agencias.value = await ObtenerAgencias()
}

const funcEditarAgencia = (row: any) => {
  visibleEditarAgencia.value = true
  id_agencia.value = row
}


const funcAgenciaAgregadaCorrecta = () => {
  toast.add({
    severity: 'success',
    summary: 'Agencia agregada',
    detail: 'La agencia se agregó correctamente.',
    life: 3000,
  })
}

const funcAgenciaAgregadaFallada = () => {
  toast.add({
    severity: 'error',
    summary: 'Error al agregar agencia',
    detail: 'Ocurrió un problema al intentar agregar la agencia.',
    life: 3000,
  })
}

const funcDetalleAgencia = (id: any) => {
  visibleDetalleAgencia.value = true
  id_agencia.value = id
}
</script>