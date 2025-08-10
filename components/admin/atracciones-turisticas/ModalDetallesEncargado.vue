<template>
  <Dialog 
    v-model:visible="visible" modal header=" " 
    :style="{ width: '40rem'}" >
    <div class="flex items-center justify-center mb-2">
      <img :src="state.src" alt="Image" class="max-h-96 rounded-xl"/>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="ring-1 ring-slate-200 rounded-sm">
        <p class="text-center text-sm p-1"><strong> Nombre Completo </strong></p>
        <p class="text-center text-sm p-2"> {{ state.nombre_completo }} </p>
      </div>

      <div class="ring-1 ring-slate-200 rounded-sm">
        <p class="text-center text-sm p-1"><strong> Correo Electronico </strong></p>
        <p class="text-center text-sm p-2"> {{ state.correo }} </p>
      </div>

      <div class="ring-1 ring-slate-200 rounded-sm">
        <p class="text-center text-sm p-1"><strong> Cedula de identidad </strong></p>
        <p class="text-center text-sm p-2"> {{ state.ci }} </p>
      </div>

      <div class="ring-1 ring-slate-200 rounded-sm">
        <p class="text-center text-sm p-1"><strong> Telefono </strong></p>
        <p class="text-center text-sm p-2"> {{ state.telefono }} </p>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { server } from '~/server/server'

interface Props{ open: boolean, id:number }

const emit = defineEmits(['close'])
const props = defineProps<Props>()
const visible = ref(props.open)
const src = ref()

const state = reactive({
  src: src.value,
  nombre_completo: 'cargando nombre',
  ci: 'cargando ci',
  correo: 'cargando correo',
  telefono: 'cargando telefono'
})

watch((visible), newValue => {
  if(!newValue){ emit('close') }
})

onMounted( async () => {
  await obtenerEncargado()
})

const obtenerEncargado = async () => {
  const res: any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas/encargado/' + props.id, {
    method: 'GET'
  })
  state.src = res.src
  state.nombre_completo = res.nombre_completo
  state.ci = res.ci
  state.correo = res.correo
  state.telefono = res.telefono
}

</script>