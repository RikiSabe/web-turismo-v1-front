<template>
  <div class="p-2">
    <Toast />
    <Dialog v-model:visible="visisbleNuevoUsuario" modal :style="{ width: '30rem' }">
      <template #header>
        <span class="font-bold whitespace-nowrap">Agregar nuevo usuario</span>
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
        <div class="flex gap-2">
          <Button label="Guardar" type="submit" fluid />
          <Button label="Cancelar" type="button" @click="visisbleNuevoUsuario = false" fluid />
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Gestion de Usuarios">
      <DataTable :value="Usuarios" size="small" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <p> No hay usuarios </p>
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
  const Roles = ref(['admin', 'turista'])
  
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