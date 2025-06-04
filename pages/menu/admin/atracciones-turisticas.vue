<template>
  <div class="p-2">
    <Toast />
    <Dialog v-model:visible="visibleNuevaAtraccionTuristica" modal :style="{ width: '30rem' }">
      <template #header>
        <span class="font-bold whitespace-nowrap"> Agregar nueva atraccion turistica </span>
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
        <div class="flex gap-2">
          <Button label="Guardar" type="submit" fluid />
          <Button label="Cancelar" type="button" fluid @click="visibleNuevaAtraccionTuristica = false"/>
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Gestion de  Atracciones Turisticas">
      <DataTable :value="AtraccionesTuristicas" showGridlines size="small" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar atraccion..." size="small"/>
            <Button label="Agregar nueva Atraccion" size="small" @click="visibleNuevaAtraccionTuristica = true" />
          </div>
        </template>
        <template #empty>
          <p class="text-center"> No hay atracciones turisticas</p>
        </template>
        <Column field="tipo" header="Tipo" />
        <Column field="nombre" header="Nombre" />
        <Column field="ubicacion" header="Ubicacion" />
        <Column field="precio" header="Precio">
          <template #body="slotProps">
            <p class="text-end"> {{ slotProps.data.precio }} bs</p>
          </template>
        </Column>
        <Column field="horarios" header="Horario" />
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
              <Button icon="pi pi-pencil" type="button" variant="text" @click="funcEditarAtraccionTuristica(slotProps.data.id)" />
              <Button icon="pi pi-eye" variant="text" severity="contrast" @click="funcDetallesAtraccionTuristica(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>

    <EditarAtraccionTuristica
      :id="id_atraccion"
      :open="VisibleEditarAtraccionTuristica"
      v-if="VisibleEditarAtraccionTuristica"
      @hidden="VisibleEditarAtraccionTuristica = false"
      @refreshList="funcObtenerAtraccionesTuristicas"
      @modified="funcAtraccionTuristicaEditada"
    />

    <DetallesAtraccionTuristica 
      :id="id_atraccion"
      :open="VisibleDetallesAtraccionTuristica"
      v-if="VisibleDetallesAtraccionTuristica"
      @hidden="VisibleDetallesAtraccionTuristica = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { AgregarAtraccionTuristica, ObtenerAtraccionesTuristicas } from '~/api/atracciones-turisticas'
  import EditarAtraccionTuristica from '~/components/admin/atracciones-turisticas/EditarAtraccionTuristica.vue'
  import DetallesAtraccionTuristica from '~/components/admin/atracciones-turisticas/DetallesAtraccionTuristica.vue'
  definePageMeta({ layout: 'menu-admin' })

  const AtraccionesTuristicas = ref<any>([])
  const visibleNuevaAtraccionTuristica = ref(false)
  const TiposAtracciones = ['Naturales', 'Culturales', 'Enoturismo', 'Eventos']
  const selectTipoAtraccion = ref()
  const toast = useToast()
  
  // Editar Atraccion Turistica
  const VisibleEditarAtraccionTuristica = ref(false)
  const id_atraccion = ref(0)

  // Detalles Atraccion Turistica
  const VisibleDetallesAtraccionTuristica = ref(false)

  const initialValues = reactive({
    tipo : selectTipoAtraccion,
    nombre: '',
    ubicacion: '',
    descripcion: '',
    horarios: '',
    precio: 0,
    estado: true,
  })

  const colorEstado = (estado: boolean) => { return estado === true ? "success" : "warn" }
  const nombreEstado = (estado: boolean) => { return estado === true ? "Activo" : "Inactivo" }

  onMounted( async () => {
    funcObtenerAtraccionesTuristicas()
  })

  async function funcObtenerAtraccionesTuristicas() {
    AtraccionesTuristicas.value = await ObtenerAtraccionesTuristicas()
  }

  const onFormSubmit = async() => {
    const response = await AgregarAtraccionTuristica(initialValues)
    if (response) {
      toast.add({ 
        severity: 'success', 
        summary: 'Atraccion Turistica agregada', 
        detail: 'La Atraccion Turistica se agregó correctamente.', 
        life: 3000
      })
      AtraccionesTuristicas.value = await ObtenerAtraccionesTuristicas()
      visibleNuevaAtraccionTuristica.value = false
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error al agregar Atraccion Turistica', 
        detail: 'Ocurrió un problema al intentar agregar la Atraccion Turistica.', 
        life: 3000
      })
    }
  }

  const funcEditarAtraccionTuristica = (row : any ) => {
    VisibleEditarAtraccionTuristica.value = true
    id_atraccion.value = row
  }

  const funcAtraccionTuristicaEditada = () => {
    toast.add({
      severity: 'success',
      summary: 'Atraccion Turistica modificada',
      detail: 'Los datos se actualizaron correctamente.',
      life: 3000,
    })
  }

  const funcDetallesAtraccionTuristica = (row : any) => {
    VisibleDetallesAtraccionTuristica.value = true
    id_atraccion.value = row
  }
</script>