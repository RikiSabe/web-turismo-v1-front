<template>
  <Toast />
  <div class="p-2">
    <Fieldset legend="Realizar Pagos">
      <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
        <Card v-for="reserva in Reservas" :key="reserva.id">
          <template #content>
            <p class="text-center font-bold"> Reserva de : {{ reserva.nombre_paquete }} </p>
            <p> Descripción:  {{ reserva.descripcion }} </p>
            <p> Tipo de paquete: {{ reserva.tipo_paquete }}</p>
            <p> Actividades : {{ reserva.actividades_paquete }} </p>
            <p class="text-end"> Estado: 
              <Tag 
                :value="nombreEstadoReserva(!reserva.estado_reserva)" 
                :severity="colorEstadoReserva(!reserva.estado_reserva)" /> 
            </p>
            <p class="text-center"> Datos de la Agencia {{ reserva. nombre_agencia }} </p>
            <p> Encargado: {{ reserva.nombre_encargado }} {{ reserva.apellido_encargado }}</p>
            <p> Correo de la agencia: {{ reserva.correo_agencia }}</p>
            <p> Contacto: {{ reserva.telefono_agencia }}</p>
          </template>
          <template #footer>
            <Button 
              v-if="reserva.estado_reserva === true" 
              label="Pagar" variant="outlined" fluid size="small" 
              @click="visibleQR = true, id_encargado = reserva.id_encargado" />
          </template>
        </Card>
      </div>
    </Fieldset>
  </div>

  <PagosQR 
    v-if="visibleQR"
    :open="visibleQR"
    :id_encargado="id_encargado"
    @close="visibleQR = false"
    @ok="toast.add({ 
      severity: 'info', 
      detail: 'Su pago será revisado por el encargado, por favor espere', 
      life:3000 })" />
</template>

<script lang="ts" setup>
import PagosQR from '~/components/turista/pago/PagoQR.vue'
import { server } from '~/server/server'

definePageMeta({ layout: 'menu-turista' }) 

const Reservas = ref<any[]>([])
const id_usuario = ref<Number>(0)
const id_encargado = ref(0)
const visibleQR = ref(false)
const toast = useToast()

onMounted(async () => {
  id_usuario.value = Number(sessionStorage.getItem('id'))
  if( id_usuario.value == 0 ){
    console.log('id no cargado')
  }
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/pagos/' + id_usuario.value, {
      method: 'GET'
    })
    Reservas.value = res
    console.log("Reservas cargadas:", JSON.stringify(Reservas.value, null, 2))
  } catch (error) {
    console.error("Error al cargar las reservas:", error)
  }
})
</script>