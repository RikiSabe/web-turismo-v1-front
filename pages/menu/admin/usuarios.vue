<template>
  <div class="p-2">
    <Toast />
    <Dialog v-model:visible="visisbleNuevoUsuario" modal :style="{ width: '30rem' }">
      <template #header>
        <span class="font-bold whitespace-nowrap">Agregar nuevo usuario</span>
      </template>
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        :validateOnValueUpdate="false"
        :validateOnBlur="true"
        @submit="onFormSubmit"
        class="flex flex-col gap-2"
      >
        <div class="flex grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
            <InputText id="nombre" name="nombre" v-model="initialValues.nombre" size="small" fluid />
            <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">{{ $form.nombre.error.message }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="apellido" class="text-sm text-slate-500"> Apellido </label>
            <InputText id="apellido" name="apellido" v-model="initialValues.apellido" size="small" fluid/>
            <Message v-if="$form.apellido?.invalid" severity="error" size="small" variant="simple">{{ $form.apellido.error.message }}</Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText id="correo" name="correo" v-model="initialValues.correo" size="small"/>
          <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">{{ $form.correo.error.message }}</Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
          <InputText id="telefono" name="telefono" v-model="initialValues.telefono" size="small"/>
          <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">{{ $form.telefono.error.message }}</Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
          <InputText id="direccion" name="direccion" v-model="initialValues.direccion" size="small"/>
          <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">{{ $form.direccion.error.message }}</Message>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm text-slate-500"> Contraseña </label>
            <InputText id="password" name="contra" v-model="initialValues.contra" size="small" fluid/>
            <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">{{ $form.contra.error.message }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="rol" class="text-sm text-slate-500"> Rol </label>
            <Select v-model="selectRol" :options="Roles" placeholder="Seleccione un Rol" fluid />
            <Message v-if="$form.rol?.invalid" severity="error" size="small" variant="simple">{{ $form.rol.error.message }}</Message>
          </div>
        </div>

        <div class="flex gap-2">
          <Button label="Guardar" type="submit" :disabled="!$form.valid" fluid />
          <Button label="Cancelar" type="button" @click="visisbleNuevoUsuario = false" fluid />
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Gestion de Usuarios">
      <DataTable :value="Usuarios" size="small" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <p class="text-center"> No hay usuarios </p>
        </template>
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar usuario..." size="small"/>
            <Button label="Agregar nuevo Usuario" size="small" @click="visisbleNuevoUsuario  = true" />
          </div>
        </template>
        <Column field="id" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="apellido" header="Apellido" />
        <Column field="correo" header="Correo Electronico" />
        <Column field="rol" header="Rol">
          <template #body="slotProps">
            <p class="text-center"> {{ slotProps.data.rol }}</p>
          </template>
        </Column>
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag :value="nombreEstado(slotProps.data.estado)" :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <!-- <Button icon="pi pi-trash" variant="text" severity="warn"/> -->
              <Button icon="pi pi-pencil" variant="text" @click="funcEditarUsuario(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <EditarUsuario
      :id="id_usuario"
      :open="VisibleEditarUsuario"
      v-if="VisibleEditarUsuario"
      @hidden="VisibleEditarUsuario = false"
      @refreshList="funcObtenerUsuario"
      @modified="funcUsuarioEditado"
    />
  </div>
</template>

<script setup lang="ts">
  import { AgregarUsuario, ObtenerUsuarios } from '~/api/usuarios'
  import { useToast } from 'primevue/usetoast'
  import EditarUsuario from '~/components/admin/usuarios/EditarUsuario.vue'
  definePageMeta({ layout: 'menu-admin' })

  const toast = useToast()
  const visisbleNuevoUsuario = ref(false)
  const Usuarios = ref<any>([])
  const selectRol = ref('')
  const Roles = ref(['admin', 'turista', 'encargado turismo'])
  
  //Editar Usuario
  const VisibleEditarUsuario = ref(false)
  const id_usuario = ref(0)

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

  const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
  const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

  onMounted( async () => {
    funcObtenerUsuario()
  })

  async function funcObtenerUsuario() {
    Usuarios.value = await ObtenerUsuarios()
  }

  const resolver = ({ values }: any) => {
    const errors: any = {};
    if (!values.nombre) {
      errors.nombre = [{ message: 'El nombre es requerido.' }];
    } else if (values.nombre.length < 2) {
      errors.nombre = [{ message: 'El nombre debe tener al menos 2 caracteres.' }];
    }
    if (!values.apellido) {
      errors.apellido = [{ message: 'El apellido es requerido.' }];
    } else if (values.apellido.length < 2) {
      errors.apellido = [{ message: 'El apellido debe tener al menos 2 caracteres.' }];
    }
    if (!values.correo) {
      errors.correo = [{ message: 'El correo electrónico es requerido.' }];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
      errors.correo = [{ message: 'El correo electrónico no es válido.' }];
    }
    if (!values.telefono) {
      errors.telefono = [{ message: 'El teléfono es requerido.' }];
    } else if (!/^\d+$/.test(values.telefono)) {
      errors.telefono = [{ message: 'El teléfono solo debe contener dígitos.' }];
    } else if (values.telefono.length < 7 || values.telefono.length > 15) {
      errors.telefono = [{ message: 'El teléfono debe tener entre 7 y 15 dígitos.' }];
    }
    if (!values.direccion) {
      errors.direccion = [{ message: 'La dirección es requerida.' }];
    } else if (values.direccion.length < 5) {
      errors.direccion = [{ message: 'La dirección debe tener al menos 5 caracteres.' }];
    }
    if (!values.contra) {
      errors.contra = [{ message: 'La contraseña es requerida.' }];
    } else if (values.contra.length < 6) {
      errors.contra = [{ message: 'La contraseña debe tener al menos 6 caracteres.' }];
    }
    if (!selectRol.value) {
      errors.rol = [{ message: 'Debe seleccionar un rol.' }];
    }
    return { errors };
  }

  const onFormSubmit = async () => {
    const response = await AgregarUsuario(initialValues)
    if (response) {
      toast.add({ 
        severity: 'success', 
        summary: 'Usuario agregado', 
        detail: 'El usuario se agregó correctamente.', 
        life: 3000 
      })
      Usuarios.value = await ObtenerUsuarios()
      visisbleNuevoUsuario.value = false
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error al agregar usuario', 
        detail: 'Ocurrió un problema al intentar agregar el usuario.', 
        life: 3000 
      })
    }
  }

  const funcEditarUsuario = (row : any ) => {
    VisibleEditarUsuario.value = true
    id_usuario.value = row
  }

  const funcUsuarioEditado = () => {
    toast.add({
      severity: 'success',
      summary: 'Usuario modificado',
      detail: 'Los datos se actualizaron correctamente.',
      life: 3000,
    })
  }
</script>