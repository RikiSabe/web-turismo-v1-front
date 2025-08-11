<template>
  <Toast />
  <div class="p-2">
    <Fieldset legend="Paquetes Turisticos">
      <DataTable 
        :value="Paquetes" size="small" showGridlines 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-1">
            <InputText 
              placeholder="buscar paquete..."
              size="small" />
            <Button 
              label="Agregar Paquete" variant="outlined" 
              @click="visibleModalAgregarPaquete = true" 
              size="small" />
          </div>
        </template>
        <template #empty>
          <p class="text-center"> No hay Paquetes </p>
        </template>
        <Column field="id" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="categoria" header="Categoria" />
        <Column field="fecha" header="Fecha" />
        <Column header="Precio">
          <template #body="slotProps">
            <span clas="text-center"> {{ slotProps.data.precio }} bs </span>
          </template>
        </Column>
        <Column field="duracion" header="Duración" />
        <Column field="salida" header="Salida" />
        <Column header="Atracciones Turisticas">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="at in slotProps.data.atracciones_turisticas" 
                  :key="at.id" severity="success" :value="at.nombre" />
              </div>
              <Button icon="pi pi-eye" variant="text" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>

  <ModalAgregarPaquete 
    :open="visibleModalAgregarPaquete"
    v-if="visibleModalAgregarPaquete"
    @close="visibleModalAgregarPaquete = false"
    @update="cargarPaquetes"
    @success="toast.add({
      severity: 'success',
      summary: 'Paquete Agregado',
      detail: 'Paquete Agregado Correctamente', 
      life: 3000 })"
    />
</template>

<script lang="ts" setup>
import { server } from '~/server/server'
import ModalAgregarPaquete from '~/components/encargado-agencia-turismo/modalAgregarPaquete.vue'
import { mookPaquetesTuristicos } from '~/mooks/paquetes-turisticos/mooks'

definePageMeta({ layout: 'menu-encargado-agencia-turismo' })

const visibleModalAgregarPaquete = ref(false)
// const Paquetes = ref<any[]>(mookPaquetesTuristicos)
const Paquetes = ref<any[]>([])
const toast = useToast()

onMounted( async () => {
  await cargarPaquetes()
})

const cargarPaquetes = async () => {
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos')
    Paquetes.value = res
  } catch (error) {
    console.error('Error al cargar los paquetes turísticos:', error)
  }
}
</script>