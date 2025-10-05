<template>
  <div class="p-2">
    <Toast />
    <Fieldset legend="Gestion de Agencias" >
      <DataTable 
        :value="Agencias" showGridlines size="small" 
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <p class="text-center"> No hay Agencias </p>
        </template>
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar agencia..." size="small"/>
            <Button 
              label="Agregar nueva Agencia" variant="outlined" size="small" 
              @click="router.push('/menu/admin/formulario/nueva-agencia')" />
          </div>
        </template>
        <Column header="#">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.id }} 
            </span>
          </template>
        </Column>
        <Column header="Nombre">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.nombre }} 
            </span>
          </template>
        </Column>
        <Column header="Dirección">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.direccion }} 
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
        <Column header="Correo Electrónico">
          <template #body="slotProps">
            <span class="text-sm"> 
              {{ slotProps.data.correo }} 
            </span>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag 
                :value="nombreEstado(slotProps.data.estado)" 
                :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Opciones">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <Button 
                icon="pi pi-pencil" variant="text"  />
                <!-- @click="funcEditarAgencia(slotProps.data.id)" /> -->
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { ObtenerAgencias } from '~/api/agencias'
import { nombreEstado, colorEstado } from '~/utils/utils';

definePageMeta({ layout: 'menu-admin'})

const Agencias = ref<any>([])
const router = useRouter()

onMounted( async () => {
  funcObtenerAgencias()
})

async function funcObtenerAgencias() {
  Agencias.value = await ObtenerAgencias()
}
</script>