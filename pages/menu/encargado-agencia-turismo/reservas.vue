<template>
  <div class="p-2">
    <Fieldset legend="Gestión de Reservas">
      <DataTable 
        :value="Reservas" showGridlines 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        size="small">
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
              <!-- <Button icon="pi pi-eye" size="small" variant="text"/> -->
            </div>
          </template>
        </Column>
        <Column header="Reservado por">
          <template #body="slotProps">
            <span> {{ slotProps.data.nombre_usuario }} </span>
          </template>
        </Column>
        <Column header="Comprobante">
          <template #body="slotProps">
            <div class="flex justify-center items-center gap-2">
              <p class="text-sm"> ver comprobante de pago </p>
              <Button 
                icon="pi pi-eye" size="small" variant="text"
                @click="abrirComprobante(slotProps.data.id_usuario, slotProps.data.id)" />
            </div>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag 
                :severity="colorEstadoReserva(slotProps.data.estado)" 
                :value="nombreEstadoReserva(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Acciones" >
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Button 
              label="decidir" size="small" 
              variant="outlined"
              @click="openDecidirReserva(slotProps.data.id)"/>
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>

  <ModalDetallesComprobante 
    :id_reserva="id_reserva"
    :id_usuario="id_usuario" 
    :open="VisibleComprobante"
    v-if="VisibleComprobante"
    @close="VisibleComprobante = false" />

  <ModalDecidirReserva 
    :id="id_reserva" 
    :open="VisibleDecidir"
    v-if="VisibleDecidir"
    @close="VisibleDecidir = false"
    @update="obtenerReservas()" />
</template>

<script setup lang="ts">
import ModalDecidirReserva from '~/components/admin/reservas/ModalDecidirReserva.vue'
import ModalDetallesComprobante from '~/components/encargado-agencia-turismo/modalDetallesComprobante.vue'
import { nombreEstadoReserva, colorEstadoReserva } from '~/utils/utils'
import { server } from '~/server/server'

definePageMeta({ layout: 'menu-encargado-agencia-turismo'}) 

const Reservas = ref<any[]>([])
const VisibleDecidir = ref(false)
const VisibleComprobante = ref(false)
const id_reserva = ref(0)
const id_usuario = ref(0)

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

const abrirComprobante = (id_usuario_param: any, id_reserva_param: any) => {
  VisibleComprobante.value = true
  console.log(id_usuario_param, id_reserva_param)
  id_usuario.value = id_usuario_param
  id_reserva.value = id_reserva_param
}

const openDecidirReserva = (id: any) => {
  VisibleDecidir.value = true
  id_reserva.value = id
}
</script>