<template>
  <div class="p-2">
    <Toast />
    <Dialog v-model:visible="visibleNuevaAgencia" modal :style="{ width: '30rem' }">
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
        <div class="flex gap-2">
          <Button label="Guardar" type="submit" fluid />
          <Button label="Cancelar" type="button" @click="visibleNuevaAgencia = false" fluid />
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Gestion de Agencias" >
      <DataTable :value="Agencias" size="small" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar agencia..." size="small"/>
            <Button label="Agregar nueva Agencia" size="small" @click="visibleNuevaAgencia  = true" />
          </div>
        </template>
        <Column field="id" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="direccion" header="Direccion" />
        <Column field="telefono" header="Telefono" />
        <Column field="correo_electronico" header="Correo Electronico" />
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
              <Button icon="pi pi-pencil" variant="text" @click="funcEditarAgencia(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <EditarAgencia
      :id="id_agencia"
      :open="visibleEditarAgencia"
      v-if="visibleEditarAgencia"
      @hidden="visibleEditarAgencia = false"
      @refreshList="funcObtenerAgencias"
      @modified="funcAgenciaEditada"
    />
  </div>
</template>

<script setup lang="ts">
  import { AgregarAgencia, ObtenerAgencias } from '~/api/agencias'
  import EditarAgencia from '~/components/admin/agencias/EditarAgencia.vue'

  definePageMeta({ layout: 'menu-admin'})

  const Agencias = ref<any>([])
  const visibleNuevaAgencia = ref(false)
  const visibleEditarAgencia = ref(false)
  const id_agencia = ref(0)
  const toast = useToast()

  const initialValues = reactive({
    nombre: '',
    direccion: '',
    telefono: '',
    correo_electronico: '',
    estado: true,
  })

  const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
  const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

  onMounted( async () => {
    funcObtenerAgencias()
  })

  async function funcObtenerAgencias() {
    Agencias.value = await ObtenerAgencias()
  }

  const funcEditarAgencia = (row: any) => {
    visibleEditarAgencia.value = true
    id_agencia.value = row
  }

  const onFormSubmit = async () => {
    const response = await AgregarAgencia(initialValues)
    if (response) {
      toast.add({ 
        severity: 'success', 
        summary: 'Agencia agregada', 
        detail: 'La agencia se agregó correctamente.', 
        life: 3000 
      })
      Agencias.value = await ObtenerAgencias()
      visibleNuevaAgencia.value = false
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error al agregar agencia', 
        detail: 'Ocurrió un problema al intentar agregar la agencia.', 
        life: 3000 
      })
    }
  }

  const funcAgenciaEditada = () => {
    toast.add({
      severity: 'success',
      summary: 'Usuario modificado',
      detail: 'Los datos se actualizaron correctamente.',
      life: 3000,
    })
  }

</script>