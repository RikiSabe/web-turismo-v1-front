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
              label="Agregar Paquete" variant="outlined" size="small"
              @click="router.push('/menu/encargado-agencia-turismo/formulario/nuevo-paquete')" />
              <!-- @click="visibleModalAgregarPaquete = true" /> -->
          </div>
        </template>
        <template #empty>
          <p class="text-center"> No hay Paquetes </p>
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
        <Column header="Descripción">
          <template #body="slotProps">
            <span class="text-sm"> {{ slotProps.data.descripcion }} </span>
          </template>
        </Column>
        <Column header="Precio">
          <template #body="slotProps">
            <span class="text-sm text-end"> {{ slotProps.data.precio }} bs </span>
          </template>
        </Column>
        <Column header="Hora Inicial">
          <template #body="slotProps">
            <span class="text-sm"> {{ modelHora(slotProps.data.hora_inicial) }} </span>
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

        <Column header="Visibilidad">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag 
                :value="nombreVisible(slotProps.data.visible)" 
                :severity="colorVisible(slotProps.data.visible)" />
            </div>
          </template>
        </Column>

      </DataTable>
    </Fieldset>
  </div>
</template>

<script lang="ts" setup>
import { server } from '~/server/server'

definePageMeta({ layout: 'menu-encargado-agencia-turismo' })

const Paquetes = ref<any[]>([])
const router = useRouter()

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

const modelHora = (salida: string | Date) => {
  const d = new Date(salida)
  return d.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

</script>