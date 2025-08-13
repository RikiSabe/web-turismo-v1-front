<template>
  <div class="p-2">
    <Fieldset legend="Gestión de Reservas">
      <DataTable 
        :value="Reservas" showGridlines 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        size="small" >
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar reserva..." size="small"/>
            <Button label="Todos" variant="outlined" size="small" severity="info" />
            <Button label="Completados" variant="outlined" size="small" severity="success" />
            <Button label="Pendientes" variant="outlined" size="small" severity="warn" />
            <Button label="Cancelados" variant="outlined" size="small" severity="danger" />
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay atracciones turisticas</p>
            <div class="flex items-center justify-center">
              <Button icon="pi pi-refresh" rounded size="small" />
            </div>
          </div>
        </template>
        <Column header="#">
          <template #body="slotProps">
            <span> {{ slotProps.data.id }} </span>
          </template>
        </Column>
        <Column header="Paquete">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <span> {{ slotProps.data.nombre_paquete }} </span>
              <Button icon="pi pi-eye" size="small" variant="text"/>
            </div>
          </template>
        </Column>
        <Column header="Reservado por">
          <template #body="slotProps">
            <span> {{ slotProps.data.nombre_usuario }} </span>
          </template>
        </Column>
        <Column header="Fecha de reserva">
          <template #body="slotProps">
            <span> {{ slotProps.data.fecha }} </span>
          </template>
        </Column>
        <Column header="Promoción">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <div v-if="slotProps.data.procion">
                <p> {{ slotProps.data.promocion.nombre }} </p>
                <Button icon="pi pi-eye" variant="text" size="small"/>
              </div>
              <div v-else>
                Sin promociones
              </div>
            </div>
          </template>
        </Column>
        <Column header="# de personas">
          <template #body="slotProps">
            <p v-if="slotProps.data.numero_personas > 1"> {{ slotProps.data.numero_personas }} personas </p>
            <p v-if="slotProps.data.numero_personas == 1"> {{ slotProps.data.numero_personas }} persona </p>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="slotProps">
            <Tag severity="success" :value="slotProps.data.estado" />
          </template>
        </Column>
        <Column header="Acciones" >
          <template #body="slotProps">
            <Button 
              label="decidir" size="small" 
              variant="outlined"
              @click="openDecidirReserva(slotProps.data.id)"/>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>

  <ModalDecidirReserva 
    :id="id_reserva" 
    :open="Visible"
    v-if="Visible"
    @close="Visible = false"
    @update="obtenerReservas()" />
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import ModalDecidirReserva from '~/components/admin/reservas/ModalDecidirReserva.vue'

definePageMeta({ layout: 'menu-admin'}) 

const Reservas = ref<any[]>([])
const Visible = ref(false)
const id_reserva = ref(0)

onMounted( async () => {
  await obtenerReservas()
})

const obtenerReservas = async () => {
  const res: any[] = await $fetch(server.HOST + '/api/v1/reservas',{
    method: 'GET'
  })
  Reservas.value = res
  console.log(Reservas.value)
}

const openDecidirReserva = (id: any) => {
  Visible.value = true
  id_reserva.value = id
}
</script>