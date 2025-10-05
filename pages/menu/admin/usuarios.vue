<template>
  <div class="p-2">
    <Toast />
    <Fieldset legend="Gestión de Usuarios">
      <DataTable 
        :value="Usuarios"
        showGridlines 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        size="small" >
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay usuarios </p>
            <div class="flex items-center justify-center">
              <Button 
                icon="pi pi-refresh" rounded 
                size="small" @click="funcObtenerUsuario" />
            </div>
          </div>
        </template>
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar usuario..." size="small"/>
            <Button 
              label="Agregar nuevo Usuario" variant="outlined" size="small" 
              @click="router.push('/menu/admin/formulario/nuevo-usuario')" />
          </div>
        </template>
        <Column header="#">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.id }} 
            </span>
          </template>
        </Column>
        <Column header="Nombres">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.nombre }} 
            </span>
          </template>
        </Column>
        <Column header="Apellido P.">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.apellido_paterno }} 
            </span>
          </template>
        </Column>
        <Column header="Apellido M.">
          <template #body="slotProps">
            <span v-if="slotProps.data.apellido_materno" class="text-sm">
              {{ slotProps.data.apellido_materno }} 
            </span>
            <span v-else class="text-sm"> N/A </span>
          </template>
        </Column>
        <Column header="C.I.">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.ci }} 
            </span>
          </template>
        </Column>
        <Column header="Correo Electrónico">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.correo }} 
            </span>
          </template>
        </Column>
        <Column header="Teléfono">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.telefono }} 
            </span>
          </template>
        </Column>
        <Column header="Rol">
          <template #body="slotProps">
            <p class="text-sm text-center"> 
              {{ slotProps.data.rol }}
            </p>
          </template>
        </Column>
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag 
                :value="nombreEstado(slotProps.data.estado)" 
                :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Opciones">
          <template #body>
            <div class="flex justify-center gap-2">
              <Button 
                icon="pi pi-pencil" variant="text"
                size="small" rounded/>
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { ObtenerUsuarios } from '~/api/usuarios'
import { nombreEstado, colorEstado } from '~/utils/utils'
definePageMeta({ layout: 'menu-admin' })

const router = useRouter()
const Usuarios = ref<any>([])

onMounted( async () => {
  await funcObtenerUsuario()
})

async function funcObtenerUsuario() {
  Usuarios.value = await ObtenerUsuarios()
}

</script>