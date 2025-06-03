<template>
  <Dialog v-model:visible="visisbleModal" modal :style="{ width: '30rem' }">
    <template #header>
      <span class="font-bold whitespace-nowrap">Modificar usuario</span>
    </template>
    <Form :initialValues @submit="onFormSubmit" class="flex flex-col gap-2">
      <div class="flex grid-cols-2 gap-2">
        <div>
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText id="nombre" v-model="initialValues.nombre" aria-describedby="nombre-help" size="small" fluid />
        </div>
        <div>
          <label for="apellido" class="text-sm text-slate-500"> Apellido </label>
          <InputText id="apellido" v-model="initialValues.apellido" aria-describedby="apellido-help" size="small" fluid/>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
        <InputText id="correo" v-model="initialValues.correo" aria-describedby="correo-help" size="small"/>
      </div>
      <div class="flex flex-col gap-2">
        <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
        <InputText id="telefono" v-model="initialValues.telefono" aria-describedby="telefono-help" size="small"/>
      </div>
      <div class="flex flex-col gap-2">
        <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
        <InputText id="direccion" v-model="initialValues.direccion" aria-describedby="direccion-help" size="small"/>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="password" class="text-sm text-slate-500"> Contraseña </label>
          <InputText id="password" v-model="initialValues.contra" aria-describedby="password-help" size="small" fluid/>
        </div>
        <div>
          <label for="rol" class="text-sm text-slate-500"> Rol </label>
          <Select v-model="selectRol" :options="Roles" placeholder="Seleccione un Rol" fluid />
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
        <Button label="Cancelar" type="button" @click="visisbleModal = false" fluid />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
  import { ModificarUsuario, ObtenerUsuario } from '~/api/usuarios';

  interface Props { open: boolean, id: number }
  const props = defineProps<Props>()
  const emit = defineEmits(['hidden', 'refreshList', 'modified'])
  const visisbleModal = ref(props.open)

  const selectRol = ref()
  const Roles = ref(['admin', 'turista'])
  const selectEstado = ref()
  const Estados = ref([
    { nombre: 'Activo', valor: true },
    { nombre: 'Inactivo', valor: false },
  ])

  const initialValues = reactive({
    rol: selectRol,
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    contra: '',
    foto: 'N/A',
    estado: selectEstado,
  })

  onMounted( async () => {
    await funcObtenerUsuario()
  })

  watch(visisbleModal, (newVal) => { if( !newVal ) { emit('hidden') } })

  async function funcObtenerUsuario() {
    const response = await ObtenerUsuario(props.id)
    initialValues.rol = response.rol
    initialValues.nombre = response.nombre
    initialValues.apellido = response.apellido
    initialValues.correo = response.correo
    initialValues.telefono = response.telefono
    initialValues.direccion = response.direccion
    initialValues.contra = response.contra
    initialValues.estado = response.estado
    initialValues.foto = response.foto
  }

  const onFormSubmit = async () => {
    const response = await ModificarUsuario(initialValues, props.id)
    if(response){
      emit('modified')
      emit('refreshList')
      visisbleModal.value = false
    }
  }
</script>