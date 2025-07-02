<template>
  <div class="p-2">
    <Button label="Agregar Paquete" variant="outlined" @click="visibleModalAgregarPaquete = true"/>

    <Dialog v-model:visible="visibleModalAgregarPaquete" header="Agregar Paquete Turistico" :style="{ width: '50rem' }">
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        :validateOnBlur="true"
        class="flex flex-col gap-3"
        @submit="handleGuardarPaquete"
      >
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Categoria</label>
            <InputText name="categoria" v-model="initialValues.categoria" />
            <Message v-if="$form.categoria?.invalid" severity="error" size="small" variant="simple">{{ $form.categoria.error.message }}</Message>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Nombre</label>
            <InputText name="nombre" v-model="initialValues.nombre" />
            <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">{{ $form.nombre.error.message }}</Message>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Fecha</label>
            <Calendar name="fecha" v-model="initialValues.fecha" showIcon dateFormat="yy-mm-dd" />
            <Message v-if="$form.fecha?.invalid" severity="error" size="small" variant="simple">{{ $form.fecha.error.message }}</Message>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Duracion</label>
            <InputText name="duracion" v-model="initialValues.duracion" />
            <Message v-if="$form.duracion?.invalid" severity="error" size="small" variant="simple">{{ $form.duracion.error.message }}</Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-slate-500">Descripcion</label>
          <Textarea name="descripcion" v-model="initialValues.descripcion" rows="3" autoResize />
          <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">{{ $form.descripcion.error.message }}</Message>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Precio</label>
            <InputNumber name="precio" v-model="initialValues.precio" :min="0" mode="decimal" :step="0.01" />
            <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">{{ $form.precio.error.message }}</Message>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-slate-500">Salida</label>
            <InputText name="salida" v-model="initialValues.salida" />
            <Message v-if="$form.salida?.invalid" severity="error" size="small" variant="simple">{{ $form.salida.error.message }}</Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-slate-500">Atracciones Turísticas</label>
          <MultiSelect name="id_atracciones" v-model="initialValues.id_atracciones" :options="atraccionesOptions" optionLabel="nombre" optionValue="id" placeholder="Seleccione atracciones" display="chip" />
          <Message v-if="$form.id_atracciones?.invalid" severity="error" size="small" variant="simple">{{ $form.id_atracciones.error.message }}</Message>
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <Button type="submit" label="Guardar" :disabled="!$form.valid" />
          <Button type="button" label="Cancelar" @click="visibleModalAgregarPaquete = false" severity="secondary" outlined />
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Paquetes Turisticos">
      <DataTable :value="Paquetes" size="small" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #empty>
          <p class="text-center"> No hay Paquetes </p>
        </template>
        <Column field="id" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="categoria" header="Categoria" />
        <Column field="precio" header="Precio" />
        <Column field="salida" header="Salida" />
        <Column field="duracion" header="Duración" />
        <Column field="atracciones_turisticas" header="Atracciones">
          <template #body="slotProps">
            <Badge v-for="at in slotProps.data.atracciones_turisticas" :key="at.id" :value="at.nombre" class="mr-2 mb-2" />
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>

<script lang="ts" setup>
  import { server } from '~/server/server'

  definePageMeta({ layout: 'menu-encargado-agencia-turismo' })
  const visibleModalAgregarPaquete = ref(false)
  const Paquetes = ref([])
  
  const initialValues = reactive({
    categoria: '',
    nombre: '',
    fecha: null,
    descripcion: '',
    precio: 0,
    duracion: '',
    salida: '',
    estado: true,
    id_agencia: 1,
    id_atracciones: [],
  })

  const atraccionesOptions = ref([])

  onMounted( async () => {
    await cargarPaquetes()
    try {
      const res: any = await $fetch( server.HOST + '/api/v1/atracciones-turisticas')
      atraccionesOptions.value = res.map((item: any) => ({ id: item.id, nombre: item.nombre }))
    } catch (error) {
      console.error('Error al cargar las atracciones turísticas:', error)
    }
  })

  const cargarPaquetes = async () => {
    try {
      const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos')
      Paquetes.value = res
    } catch (error) {
      console.error('Error al cargar los paquetes turísticos:', error)
    }
  }

  const resolver = ({ values }: any) => {
    const errors: any = {};

    if (!values.categoria) errors.categoria = [{ message: 'La categoría es requerida.' }];
    if (!values.nombre) errors.nombre = [{ message: 'El nombre es requerido.' }];
    if (!values.fecha) errors.fecha = [{ message: 'La fecha es requerida.' }];
    if (!values.descripcion) errors.descripcion = [{ message: 'La descripción es requerida.' }];
    if (values.precio === null || values.precio < 0) errors.precio = [{ message: 'El precio debe ser mayor o igual a 0.' }];
    if (!values.duracion) errors.duracion = [{ message: 'La duración es requerida.' }];
    if (!values.salida) errors.salida = [{ message: 'El lugar de salida es requerido.' }];
    if (!values.id_agencia) errors.id_agencia = [{ message: 'Debe seleccionar una agencia.' }];
    if (!values.id_atracciones || values.id_atracciones.length === 0) errors.id_atracciones = [{ message: 'Seleccione al menos una atracción.' }];

    return { errors };
  }

  const handleGuardarPaquete = async () => {
    try {
      const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos', {
        method: 'POST',
        body: initialValues
      })
      cargarPaquetes()
      visibleModalAgregarPaquete.value = false
      initialValues.id_atracciones = []
      initialValues.fecha = null
    } catch (error) {
      console.error('Error al guardar el paquete turístico:', error)
    }
  }
</script>