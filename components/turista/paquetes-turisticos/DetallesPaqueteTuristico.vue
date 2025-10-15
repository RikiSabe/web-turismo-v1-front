<template>
  <Dialog v-model:visible="visible" modal header="Detalles del Paquete Turístico" style="width: 52rem;">
    <div class="relative overflow-hidden rounded-lg">
      <div
        class="relative h-96 bg-cover bg-center bg-no-repeat flex items-end grayscale-75"
        :style="{ backgroundImage: 'url(/images/paquete-turistico.jpg)' }" >
        <div class="relative z-10 p-8 text-white w-full">
          <div class="flex justify-between items-end">
            <div class="flex-1">
              <h1 class="text-4xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                {{ Paquete ? Paquete.nombre : 'Cargando...' }}
              </h1>
              <!-- <div class="grid grid-cols-5 gap-1">
                <Badge v-for="sc in Paquete.subcategorias" :value="sc" severity="secondary" />
              </div> -->
            </div>

            <div class="text-right ml-8">
              <div class="mb-1">
                <span class="text-gray-200 text-xs font-bold">Desde</span>
              </div>
              <div class="flex items-baseline gap-2 mb-4 justify-end">
                <span class="text-3xl font-bold text-white">{{ Paquete.precio }} bs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2">
        <div class="flex flex-col items-center justify-center">
          <p class="text-gray-600 text-sm leading-relaxed mb-2"> {{ Paquete.descripcion }} </p>
        </div>
        <div>
          <div class="ring-1 ring-slate-200 rounded-sm m-2 p-2">
            <Timeline :value="Paquete.atracciones" align="alternate" >
              <template #marker>
                <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: 'salmon' }">
                    <i class="pi pi-heart-fill"></i>
                </span>
              </template>
              <template #content="slotProps">
                <div class="flex flex-col items-center m-2 ring ring-slate-200 rounded-lg p-2">
                  <span class="font-bold text-xl"> {{ slotProps.item.nombre }} </span>
                  <Divider />
                  <img :alt="slotProps.item.nombre" :src="slotProps.item.foto" class="h-40 w-64 rounded-lg m-2" />
                  <span class="text-sm text-center"> {{ slotProps.item.descripcion }} </span>
                  <Divider />
                  <span> {{ slotProps.item.duracion }} hrs de duración </span>
                </div>
              </template>
            </Timeline>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 p-4">
      <label class="font-bold text-lg">Seleccione el número de personas:</label>
      <Select 
        v-model="NumeroPersonas"
        :options="[ 
          { label: '1 Persona', value: 1 }, 
          { label: '2 Personas', value: 2 }, 
          { label: '3 Personas', value: 3 }, 
          { label: '4 Personas', value: 4 } 
        ]"
        placeholder="Número de Personas"
        class="w-48"
        optionLabel="label"
        optionValue="value"
      />
    </div>
    <div class="flex justify-end gap-2 m-4">
      <Button
        label="Reservar Ahora"
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg text-lg transition-colors duration-200"
        @click="handleReservation" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { server } from '~/server/server';
interface Props {
  open: boolean;
  id: number;
}
const props = defineProps<Props>();
const emit = defineEmits(["hidden", "confirm"]);
const visible = ref<boolean>(true);
watch(visible, (newVal) => { if( !newVal ) { emit('hidden') } })
const id_usuario = ref<number>(0)
const NumeroPersonas = ref<number>(1)
const Paquete = reactive({
  id: 1,
  nombre: 'Paquete Aventura en los Andes',
  descripcion: 'Un recorrido de aventura que combina naturaleza, historia y cultura en el corazón de los Andes bolivianos.',
  precio: 480.50,
  subcategorias: ["Museo", "Festival", "Arqueología"],
  hora_inicio: "08:00 am",
  atracciones: [
    {
      "id": 1,
      "nombre": "Salar de Uyuni",
      "foto": "N/A",
      "duracion": 4,
      "descripcion": "El desierto de sal más grande del mundo, con paisajes únicos que reflejan el cielo durante la temporada de lluvias. Ideal para fotografía, observación de estrellas y recorridos en 4x4.",
      "orden": 1
    },
    {
      "id": 2,
      "nombre": "Isla Incahuasi",
      "foto": "N/A",
      "duracion": 2,
      "descripcion": "Una isla en medio del Salar de Uyuni cubierta de cactus gigantes y formaciones rocosas de origen coralino. Ofrece una vista panorámica espectacular del salar.",
      "orden": 2
    }
  ]
})

onMounted( async () => {
  id_usuario.value = Number(sessionStorage.getItem('id'))
  await obtenerPaquete(props.id)  
})

async function obtenerPaquete(id: number){
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos/foto/' + id, {
      method: 'GET'
    })
    Paquete.nombre = res.nombre
    Paquete.precio = res.precio
    Paquete.descripcion = res.descripcion
    Paquete.atracciones = res.atracciones
    console.log("Paquete turístico cargado:", JSON.stringify(res, null, 2));
  } catch (error) {
    console.error("Error al cargar el paquete turístico:", error)
  }
}

const handleReservation = async () => {
  console.log("Procesando reserva...", id_usuario.value);
  if( !id_usuario ) {
    console.log("sin id de usuario")
    return
  }
  try {
    await $fetch(server.HOST + '/api/v1/reservas', {
      method: 'POST',
      body: {
        id_paquete: props.id,
        id_usuario: id_usuario.value,
        numero_personas: NumeroPersonas.value,
        descripcion: `Reserva del paquete turístico con nombre: ${Paquete.nombre}, para ${NumeroPersonas.value} persona(s).`,
        estado: true,
      }
    })
    visible.value = false;
    emit('confirm')
  } catch(error) {
    console.error("Error al procesar la reserva:", error);
  }   
}
</script>
