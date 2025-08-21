<template>
  <Dialog 
    v-model:visible="visibleModal" modal 
    header="Detalles Atraccion Turistica" :style="{ width: '42rem' }">
    <template #header>
      <p class="text-xl font-bold"> {{ state.nombre }}</p>
    </template>
    <Carousel
      :value="Fotos" :numVisible="1" :numScroll="1" :showNavigators="false"
      circular :autoplayInterval="3000">
      <template #item="slotProps">
        <div class="rounded">
          <div class="relative mx-auto">
            <img 
              :src="slotProps.data.foto" :alt="slotProps.data.name"
              class="w-full h-96 rounded contain-content" />
          </div>
        </div>
      </template>
    </Carousel>
    <Fieldset legend="Detalles de la atracción turistica">
      <div class="grid grid-cols-4 gap-2">
        <!-- Tipo -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Tipo </strong></p>
          <p class="text-center text-sm p-2"> {{ state.tipo }} </p>
        </div>
        <!-- Precio -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Precio </strong></p>
          <p class="text-center text-sm p-2"> {{ state.precio }} bs </p>
        </div>
        <!-- Horario Apertura -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Horario de Apertura </strong></p>
          <p class="text-center text-sm p-2"> {{ state.horario_apertura }} </p>
        </div>
        <!-- Horario Cierre -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Horario de Cierre </strong></p>
          <p class="text-center text-sm p-2"> {{ state.horario_cierre }} </p>
        </div>
      </div>

      <div class="grid grid-cols-4 mt-2 gap-2">
        <!-- Departamento -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Departamento </strong></p>
          <p class="text-center text-sm p-2"> {{ state.departamento }} </p>
        </div>
        <!-- Provincia -->
        <div class="ring-1 ring-slate-200 rounded-sm">
          <p class="text-center text-sm p-1"><strong> Provincia </strong></p>
          <p class="text-center text-sm p-2"> {{ state.provincia }} </p>
        </div>
        <!-- Direccion -->
        <div class="ring-1 ring-slate-200 rounded-sm col-span-2">
          <p class="text-center text-sm p-1"><strong> Lugar </strong></p>
          <p class="text-center text-sm p-2"> {{ state.direccion }} </p>
        </div>
      </div>

      <div>
        <div class="ring-1 ring-slate-200 rounded-sm col-span-2 mt-2">
          <p class="text-sm p-1 ml-2"><strong> Descripción </strong></p>
          <p class="text-sm p-1 ml-2"> {{ state.descripcion }} </p>
        </div>
      </div>
    </Fieldset>
  </Dialog>
</template>

<script setup lang="ts">
import { server } from '~/server/server';

interface Props { open: boolean, id: number }
const props = defineProps<Props>()
const emit = defineEmits(['hidden'])
const visibleModal = ref(props.open)
const Fotos = ref<any[]>([])

watch(visibleModal, (newVal) => { if( !newVal ) { emit('hidden') } })

const state = reactive({
  nombre: 'Cargando nombre de la atracción turistica',
  tipo: 'cargando tipo',
  horario_apertura: 'cargando horario de apertura',
  horario_cierre: 'cargando horario de cierre',
  precio: 'cargando precio en',
  direccion: 'cargando dirección',
  departamento: 'cargando departamento',
  provincia: 'cargando privincia',
  descripcion: 'cargando descripción'
})

onMounted( async() => {
  await funcObtenerAtraccionTuristica()
})

async function funcObtenerAtraccionTuristica() {
  const res: any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas/' + props.id, {
    method: 'GET'
  })
  // Datos
  state.tipo = res.categoria
  state.nombre = res.nombre
  state.direccion = res.direccion
  state.descripcion = res.descripcion
  state.horario_apertura = res.horario_apertura
  state.horario_cierre = res.horario_cierre
  state.precio = res.precio
  state.departamento = res.ubicacion.departamento.nombre
  state.provincia = res.ubicacion.provincia.nombre
  // Fotos
  Fotos.value = res.fotos.sort((a: any, b: any) => a.orden - b.orden )
}

</script>