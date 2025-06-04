<template>
  <Dialog v-model:visible="visibleModal" modal header="Detalles Atraccion Turistica" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <p class="text-xl font-bold"> {{ state.nombre }}</p>
    </template>
    <div class="flex justify-center rounded-lg pb-2">
      <img alt="user header" src="/images/photo_turismo.jpg"/>
    </div>
    <Panel>
      <div class="grid grid-cols-2">
        <!-- Tipo -->
        <div>
          <p class="text-center text-sm"><strong>Tipo</strong></p>
          <p class="text-center text-sm"> {{ state.tipo }} </p>
        </div>
        <!-- Precio -->
        <div>
          <p class="text-center text-sm"><strong> Precio </strong></p>
          <p class="text-center text-sm"> {{ state.precio }} bs </p>
        </div>
        <!-- Direccion -->
        <div>
          <p class="text-center text-sm"><strong> Direccion </strong></p>
          <p class="text-center text-sm"> {{ state.ubicacion }} </p>
        </div>
        <!-- Horarios -->
        <div>
          <p class="text-center text-sm"><strong> Horarios </strong></p>
          <p class="text-center text-sm"> {{ state.horarios }} </p>
        </div>
      </div>
      <div>
        <p class="text-center text-sm"><strong> Descripcion </strong></p>
        <p class="text-center text-sm"> {{ state.descripcion }} </p>
      </div>
    </Panel>
  </Dialog>
</template>

<script setup lang="ts">
  import { ObtenerAtraccionTuristica } from '~/api/atracciones-turisticas'
  interface Props { open: boolean, id: number }
  const props = defineProps<Props>()
  const emit = defineEmits(['hidden'])
  const visibleModal = ref(props.open)
  watch(visibleModal, (newVal) => { if( !newVal ) { emit('hidden') } })

  const state = reactive({
    tipo: '',
    nombre: '',
    ubicacion: '',
    descripcion: '',
    horarios: '',
    precio: ''
  })

  onMounted( async() => {
    await funcObtenerAtraccionTuristica()
  })

  async function funcObtenerAtraccionTuristica() {
    const response = await ObtenerAtraccionTuristica(props.id)
    state.tipo = response.tipo
    state.nombre = response.nombre
    state.ubicacion = response.ubicacion
    state.descripcion = response.descripcion
    state.horarios = response.horarios
    state.precio = response.precio
  }

</script>