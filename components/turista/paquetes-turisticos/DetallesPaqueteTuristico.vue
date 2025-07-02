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

      <div class="p-6 bg-white">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800"> Descripción del Paquete </h3>
            <p class="text-gray-600 leading-relaxed"> {{ Paquete.descripcion }} </p>
            <div class="flex items-center">
              <Timeline :value="Paquete.atracciones" class="w-full">
                <template #opposite="slotProps">
                    <small class="text-surface-500"> {{ slotProps.item.horarios }}</small>
                </template>
                <template #content="slotProps">
                  {{ slotProps.item.nombre }} , {{ slotProps.item.descripcion }}
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
      const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos/' + props.id)
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
      const res = await $fetch(server.HOST + '/api/v1/reservas', {
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
