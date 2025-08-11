<template>
  <Dialog v-model:visible="visible" modal maximizable header="Detalles del Paquete Turístico" >
    <div class="relative overflow-hidden rounded-lg">
      <div
        class="relative h-96 bg-cover bg-center bg-no-repeat flex items-end"
        :style="{ backgroundImage: 'url(/images/photo_turismo.jpg)' }" >
        <div class="relative z-10 p-8 text-white w-full">
          <div class="flex justify-between items-end">
            
            <div class="flex-1">
              <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                {{ Paquete ? Paquete.nombre : 'Cargando...' }}
              </h1>
              <div class="flex flex-wrap gap-2 mb-4">
                <Badge :value="Paquete.categoria" class="bg-blue-600 text-white px-3 py-1" />
              </div>
            </div>

            <div class="text-right ml-8">
              <div class="mb-2">
                <span class="text-gray-300 text-sm">Desde</span>
              </div>
              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-bold text-white">{{ Paquete.precio }} bs</span>
              </div>
              <Button
                label="Reservar Ahora"
                class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg text-lg transition-colors duration-200"
                @click="handleReservation"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="p-2">
        <div>
          <div>
            <div class="flex flex-col items-center justify-center">
                <span class="text-xl font-semibold text-gray-800"> Descripción del Paquete </span>
                <p class="text-gray-600 leading-relaxed mb-2"> {{ Paquete.descripcion }} </p>
            </div>
            
            <div class="ring-1 ring-slate-200 rounded-sm m-2 p-2">
              <Timeline :value="Paquete.atracciones" align="alternate">
                <template #marker>
                  <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: 'salmon' }">
                      <i class="pi pi-heart-fill"></i>
                  </span>
                </template>
                <template #opposite="slotProps">
                  <div>
                    <span> Horarios </span>
                  </div>
                  <div>
                    {{ slotProps.item.horario_apertura }} - {{ slotProps.item.horario_cierre }}
                  </div>
                </template>
                <template #content="slotProps">
                  <div class="flex flex-col items-center">
                    <img :alt="slotProps.item.nombre" src="/public/images/photo_turismo.jpg" class="h-40 w-64 rounded-lg" />
                    <span> {{ slotProps.item.nombre }} , {{ slotProps.item.descripcion }} </span>
                  </div>
                </template>
              </Timeline>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="visible = false" />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { server } from '~/server/server';
interface Props {
  open: boolean;
  id: number;
}
const props = defineProps<Props>();
const emit = defineEmits(["hidden"]);
const visible = ref<boolean>(props.open);
watch(visible, (newVal) => { if( !newVal ) { emit('hidden') } })

const Paquete = reactive({
  id: 0,
  nombre: '',
  descripcion: '',
  precio: 0,
  categoria: '',
  atracciones: [] as any[],
})

onMounted( async () => {
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos/' + props.id, {
      method: 'GET'
    })
    Paquete.id = res.id;
    Paquete.nombre = res.nombre;
    Paquete.descripcion = res.descripcion;
    Paquete.precio = res.precio;
    Paquete.categoria = res.categoria;
    Paquete.atracciones = res.atracciones_turisticas || [];
    console.log("Paquete turístico cargado:", JSON.stringify(Paquete, null, 2));
  } catch (error) {
    console.error("Error al cargar el paquete turístico:", error)
  }
})

const handleReservation = async () => {
  console.log("Procesando reserva...");
  try {
    await $fetch(server.HOST + '/api/v1/reservas/1', {
      method: 'POST',
      body: {
        id_paquete: Paquete.id,
        id_usuario: localStorage.getItem('id'),
        fecha: new Date().toISOString(),
        numero_personas: 1,
        descripcion: `Reserva del paquete turístico ${Paquete.nombre}`,
        estado: true,
      }
    })
    visible.value = false;
  } catch (error) {
    console.error("Error al procesar la reserva:", error);
  }   
}
</script>
