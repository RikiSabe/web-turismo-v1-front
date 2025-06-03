<template>
  <Dialog v-model:visible="visibleModal" modal :style="{ width: '30rem' }">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nueva agencia</span>
    </template>
    <Form :initialValues @submit="onFormSubmit" class="flex flex-col gap-2">
      <div class="flex grid-cols-2 gap-2">
        <div>
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText id="nombre" v-model="initialValues.nombre" aria-describedby="nombre-help" size="small" fluid />
        </div>
        <div>
          <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
          <InputText id="direccion" v-model="initialValues.direccion" aria-describedby="direccion-help" size="small" fluid/>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
        <InputText id="telefono" v-model="initialValues.telefono" aria-describedby="telefono-help" size="small"/>
      </div>
      <div class="flex flex-col gap-2">
        <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
        <InputText id="correo" v-model="initialValues.correo_electronico" aria-describedby="correo-help" size="small"/>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-2">
          <label for="estado" class="text-sm text-slate-500"> Estado </label>
          <Select :options="Estados" option-label="nombre" option-value="valor" v-model="selectEstado" size="small"/>
        </div>
      </div>
      <div class="flex gap-2">
        <Button label="Guardar" type="submit" fluid />
        <Button label="Cancelar" type="button" @click="visibleModal = false" fluid />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { ModificarAgencia, ObtenerAgencia } from '~/api/agencias';

  interface Props { open: boolean, id: number }
  const props = defineProps<Props>()
  const emit = defineEmits(['hidden', 'refreshList', 'modified'])
  const visibleModal = ref(props.open)

  const selectEstado = ref()
  const Estados = ref([
    { nombre: 'Activo', valor: true },
    { nombre: 'Inactivo', valor: false },
  ])

  const initialValues = reactive({
    nombre: '',
    direccion: '',
    telefono: '',
    correo_electronico: '',
    estado: selectEstado,
  })

  onMounted( async () => {
    funcObtenerAgencia()
  })

  watch(visibleModal, (newVal) => { if( !newVal ) { emit('hidden') } })

  async function funcObtenerAgencia() {
    const response = await ObtenerAgencia(props.id)
    initialValues.nombre = response.nombre
    initialValues.direccion = response.direccion
    initialValues.telefono = response.telefono
    initialValues.correo_electronico = response.correo_electronico
    selectEstado.value = response.estado
  }

  const onFormSubmit = async () => {
    const response = await ModificarAgencia(initialValues, props.id)
    if(response){
      emit('modified')
      emit('refreshList')
      visibleModal.value = false
    }
  }

</script>