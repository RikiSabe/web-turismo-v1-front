<template>
  <div class="p-2">
    <Toast />
    <Fieldset legend="Gestion de Usuarios">
      <DataTable :value="Usuarios" size="small" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay usuarios </p>
            <div class="flex items-center justify-center">
              <Button icon="pi pi-refresh" rounded size="small" @click="funcObtenerUsuario" />
            </div>
          </div>
        </template>
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar usuario..." size="small"/>
            <Button label="Agregar nuevo Usuario" variant="outlined" size="small" @click="funcNuevoUsuario" />
          </div>
        </template>
        <Column field="id" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="apellido_paterno" header="Apellido Paterno" />
        <Column field="apellido_materno" header="Apellido Materno" />
        <Column field="ci" header="CI" />
        <Column field="correo" header="Correo Electronico" />
        <Column field="telefono" header="Telefono" />
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
              <Button icon="pi pi-pencil" variant="text" @click="funcEditarUsuario(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <ModalEditarUsuario
      v-if="VisibleEditarUsuario"
      :id="id_usuario" :open="VisibleEditarUsuario"
      @hidden="VisibleEditarUsuario = false" 
      @refreshList="funcObtenerUsuario" 
      @modified="funcUsuarioEditado" />
    
    <ModalAgregarUsuario
      v-if="VisibleNuevoUsuario"
      :open="VisibleNuevoUsuario"
      @hidden="VisibleNuevoUsuario = false" 
      @refreshList="funcObtenerUsuario" 
      @addedcorrect="funcUsuarioAgregadoCorrecto"
      @addedfail="funcUsuarioAgregadoFallido" />

  </div>
</template>

<script setup lang="ts">
  import { ObtenerUsuarios } from '~/api/usuarios'
  import ModalEditarUsuario from '~/components/admin/usuarios/ModalEditarUsuario.vue'
  import ModalAgregarUsuario from '~/components/admin/usuarios/ModalAgregarUsuario.vue'
  
  definePageMeta({ layout: 'menu-admin' })

  const toast = useToast()
  const Usuarios = ref<any>([])
  const VisibleEditarUsuario = ref(false)
  const id_usuario = ref(0)
  const VisibleNuevoUsuario = ref(false)
  const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
  const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

  onMounted( async () => {
    await funcObtenerUsuario()
  })

  async function funcObtenerUsuario() {
    Usuarios.value = await ObtenerUsuarios()
  }

  const funcEditarUsuario = (row : any ) => {
    VisibleEditarUsuario.value = true
    id_usuario.value = row
  }

  const funcNuevoUsuario = () => {
    VisibleNuevoUsuario.value = true
  }

  const funcUsuarioEditado = () => {
    toast.add({
      severity: 'success',
      summary: 'Usuario modificado',
      detail: 'Los datos se actualizaron correctamente.',
      life: 3000,
    })
  }

  const funcUsuarioAgregadoCorrecto = () => {
    toast.add({
      severity: 'success',
      summary: 'Usuario agregado',
      detail: 'El usuario se agregó correctamente.',
      life: 3000,
    })
  }

  const funcUsuarioAgregadoFallido = () => {
    toast.add({ 
      severity: 'error', 
      summary: 'Error al agregar usuario', 
      detail: 'Ocurrió un problema al intentar agregar el usuario.', 
      life: 3000,
    })
  }
</script>