<template>
  <Drawer v-model:visible="visibleModal" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nuevo usuario</span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-2"
      :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false" :validateOnBlur="true"
      @submit="onFormSubmit">
      <div class="grid grid-cols-3 gap-2">
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText id="nombre" name="nombre" v-model="initialValues.nombre" size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="apellido" class="text-sm text-slate-500"> Apellido </label>
          <InputText id="apellido" name="apellido" v-model="initialValues.apellido" size="small" fluid/>
          <Message v-if="$form.apellido?.invalid" severity="error" size="small" variant="simple">
            {{ $form.apellido.error.message }}
          </Message>
        </div>
        
        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText id="correo" name="correo" v-model="initialValues.correo" size="small"/>
          <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
            {{ $form.correo.error.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
          <InputText id="telefono" name="telefono" v-model="initialValues.telefono" size="small"/>
          <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
            {{ $form.telefono.error.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
          <InputText id="direccion" name="direccion" v-model="initialValues.direccion" size="small"/>
          <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.direccion.error.message }}
          </Message>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm text-slate-500"> Contraseña </label>
            <InputText id="password" name="contra" v-model="initialValues.contra" size="small" fluid/>
            <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">
              {{ $form.contra.error.message }}
            </Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="rol" class="text-sm text-slate-500"> Rol </label>
            <Select v-model="selectRol" :options="Roles" placeholder="Seleccione un Rol" fluid />
            <Message v-if="$form.rol?.invalid" severity="error" size="small" variant="simple">
              {{ $form.rol.error.message }}
            </Message>
          </div>
        </div>
      </div>

      <p class="text-center"> Seleccione una imagen para foto de perfil </p>
      <div class="card flex flex-col items-center gap-2 mb-2">
        <FileUpload 
          customUpload auto
          mode="basic" severity="secondary" class="p-button-outlined" accept="image/*"
          @select="onFileSelect" />
        <img
          v-if="src" :src="src" alt="Image"
          class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
        <p v-else class="text-center text-slate-500"> No hay imagen seleccionada </p>
        <Button v-if="src" label="Eliminar Imagen" severity="danger" variant="outlined" @click="src = null" />
      </div>
      <div class="flex gap-2">
        <Button label="Guardar" type="submit" :disabled="!$form.valid" fluid />
        <Button label="Cancelar" type="button" @click="visibleModal = false" fluid />
      </div>
    </Form>
  </Drawer>
</template>

<script setup lang="ts">
  import { AgregarUsuario } from '~/api/usuarios'
  import { validarUsuario } from '~/functions/validadores';
  interface Props { open: boolean }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['hidden', 'refreshList', 'addedcorrect', 'addedfail'])
  const visibleModal = ref(props.open)
  const selectRol = ref('')
  const Roles = ref(['admin', 'turista', 'encargado turismo'])

  watch(visibleModal, (newVal) => { if( !newVal ) { emit('hidden') } })
  const initialValues = reactive({
    rol: selectRol,
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    contra: '',
    foto: 'N/A',
    estado: true,
  })

  const src = ref<any>(null)

  const resolver = ({ values }: any) => {
    const errors = validarUsuario(values)
    if (!selectRol.value) {
      errors.rol = [{ message: 'Debe seleccionar un rol.' }]
    }
    return { errors }
  }

  const onFormSubmit = async () => {
    const response = await AgregarUsuario(initialValues)
    if (response) {
      emit('addedcorrect')
      emit('refreshList')
      visibleModal.value = false
    } else {
      emit('addedfail')
    }
  }

  function onFileSelect(event:any) {
    const file = event.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
        src.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
</script>