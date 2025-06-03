<template>
  <Dialog v-model:visible="visibleModal" modal :style="{ width: '30rem' }">
    <template #header>
      <span class="font-bold whitespace-nowrap"> Modificar atraccion turistica </span>
    </template>
    <Form :initialValues @submit="onFormSubmit" class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <div>
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText id="nombre" v-model="initialValues.nombre" aria-describedby="nombre-help" size="small" fluid />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col">
          <label for="tipo" class="text-sm text-slate-500"> Tipo </label>
          <!-- <InputText id="tipo" aria-describedby="tipo-help" size="small" fluid/> -->
          <Select :options="TiposAtracciones" v-model="selectTipoAtraccion" placeholder="Seleccione tipo" />
        </div>
        <div>
          <label for="horario" class="text-sm text-slate-500"> Horarios </label>
          <InputText id="horario" v-model="initialValues.horarios" aria-describedby="horario-help" size="small" fluid/>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="precio" class="text-sm text-slate-500"> Precio </label>
          <InputNumber v-model="initialValues.precio" :min="0" aria-describedby="precio-help" mode="decimal" :step="0.01" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div>
          <label for="ubicacion" class="text-sm text-slate-500"> Ubicacion </label>
          <InputText id="ubicacion" v-model="initialValues.ubicacion" aria-describedby="ubicacion-help" size="small" fluid/>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div>
          <label for="descripcion" class="text-sm text-slate-500"> Descripcion </label>
          <InputText id="descripcion" v-model="initialValues.descripcion" aria-describedby="descripcion-help" size="small" fluid/>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-2">
          <label for="estado" class="text-sm text-slate-500"> Estado </label>
          <Select :options="Estados" option-label="nombre" option-value="valor" v-model="selectEstado" size="small"/>
        </div>
      </div>
      <div class="flex gap-2">
        <Button label="Guardar" type="submit" fluid />
        <Button label="Cancelar" type="button" fluid @click="visibleModal = false"/>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
  import { ModificarAtraccionTuristica, ObtenerAtraccionTuristica } from '~/api/atracciones-turisticas'
  
  interface Props { open: boolean, id: number }
  const props = defineProps<Props>()
  const emit = defineEmits(['hidden', 'refreshList', 'modified'])
  const visibleModal = ref(props.open)

  const TiposAtracciones = ['Naturales', 'Culturales', 'Enoturismo', 'Eventos']
  const selectTipoAtraccion = ref()
  const selectEstado = ref()
  const Estados = ref([
    { nombre: 'Activo', valor: true },
    { nombre: 'Inactivo', valor: false },
  ])

  const initialValues = reactive({
    tipo : selectTipoAtraccion,
    nombre: '',
    ubicacion: '',
    descripcion: '',
    horarios: '',
    precio: 0,
    estado: selectEstado,
  })

  onMounted( async () => {
    await funcObtenerAtraccionTuristica()
  })

  watch(visibleModal, (newVal) => { if( !newVal ) { emit('hidden') } })

  async function funcObtenerAtraccionTuristica() {
    const response = await ObtenerAtraccionTuristica(props.id)
    selectTipoAtraccion.value = response.tipo
    initialValues.nombre = response.nombre
    initialValues.ubicacion = response.ubicacion
    initialValues.descripcion = response.descripcion
    initialValues.horarios = response.horarios
    initialValues.precio = response.precio
    initialValues.estado = response.estado
  }

  const onFormSubmit = async () => {
    const response = await ModificarAtraccionTuristica(initialValues, props.id)
    if(response){
      emit('modified')
      emit('refreshList')
      visibleModal.value = false
    }
  }
</script>