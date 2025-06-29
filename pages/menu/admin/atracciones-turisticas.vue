<template>
  <div class="p-2">
    <Toast />
    <Dialog v-model:visible="visibleNuevaAtraccionTuristica" modal :style="{ width: '30rem' }">
      <template #header>
        <span class="font-bold whitespace-nowrap"> Agregar nueva atraccion turistica </span>
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
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
            <InputText id="nombre" name="nombre" v-model="initialValues.nombre" size="small" fluid />
            <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">{{ $form.nombre.error.message }}</Message>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500"> Tipo </label>
            <Select :options="TiposAtracciones" v-model="selectTipoAtraccion" placeholder="Seleccione tipo" />
            <Message v-if="$form.tipo?.invalid" severity="error" size="small" variant="simple">{{ $form.tipo.error.message }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="horario" class="text-sm text-slate-500"> Horarios </label>
            <InputText id="horario" name="horarios" v-model="initialValues.horarios" size="small" fluid/>
            <Message v-if="$form.horarios?.invalid" severity="error" size="small" variant="simple">{{ $form.horarios.error.message }}</Message>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label for="precio" class="text-sm text-slate-500"> Precio </label>
            <InputNumber id="precio" name="precio" v-model="initialValues.precio" :min="0" aria-describedby="precio-help" mode="decimal" :step="0.01" />
            <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">{{ $form.precio.error.message }}</Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="ubicacion" class="text-sm text-slate-500"> Ubicacion </label>
          <InputText id="ubicacion" name="ubicacion" v-model="initialValues.ubicacion" size="small" fluid/>
          <Message v-if="$form.ubicacion?.invalid" severity="error" size="small" variant="simple">{{ $form.ubicacion.error.message }}</Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="descripcion" class="text-sm text-slate-500"> Descripcion </label>
          <InputText id="descripcion" name="descripcion" v-model="initialValues.descripcion" size="small" fluid/>
          <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">{{ $form.descripcion.error.message }}</Message>
        </div>

        <div class="flex gap-2">
          <Button label="Guardar" type="submit" :disabled="!$form.valid" fluid />
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

  const resolver = ({ values }: any) => {
    const errors: any = {};
    if (!values.nombre) {
      errors.nombre = [{ message: 'El nombre es requerido.' }];
    } else if (values.nombre.length < 3) {
      errors.nombre = [{ message: 'El nombre debe tener al menos 3 caracteres.' }];
    }
    if (!selectTipoAtraccion.value) {
      errors.tipo = [{ message: 'Debe seleccionar un tipo.' }];
    }
    if (!values.horarios) {
      errors.horarios = [{ message: 'El horario es requerido.' }];
    }
    if (values.precio == null || values.precio < 0) {
      errors.precio = [{ message: 'El precio es requerido y debe ser mayor o igual a 0.' }];
    }
    if (!values.ubicacion) {
      errors.ubicacion = [{ message: 'La ubicación es requerida.' }];
    } else if (values.ubicacion.length < 5) {
      errors.ubicacion = [{ message: 'La ubicación debe tener al menos 5 caracteres.' }];
    }
    if (!values.descripcion) {
      errors.descripcion = [{ message: 'La descripción es requerida.' }];
    } else if (values.descripcion.length < 10) {
      errors.descripcion = [{ message: 'La descripción debe tener al menos 10 caracteres.' }];
    }
    return { errors };
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