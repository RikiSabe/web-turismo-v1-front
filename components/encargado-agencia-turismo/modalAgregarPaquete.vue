<template>
  <Drawer v-model:visible="visibleModalAgregarPaquete" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nuevo paquete turistico</span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-3" id="form_nuevo_paquete_turistico"
      @submit="handleGuardarPaquete" :resolver="resolver"
      :initialValues="initialValues">

      <div class="grid grid-cols-2 gap-3">
        <!-- Categoria paquete -->
        <div class="flex flex-col gap-1">
          <label for="categoria" class="text-sm text-slate-500"> Categoria </label>
          <InputText 
            id="categoria" name="categoria"  placeholder="Ingrese la categoria del paquete"
            v-model="initialValues.categoria"
            size="small" fluid />
          <Message v-if="$form.categoria?.invalid" severity="error" size="small" variant="simple">
            {{ $form.categoria.error.message }}
          </Message>
        </div>

        <!-- Nombre paquete -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre" placeholder="Ingrese el nombre del paquete"
            v-model="initialValues.nombre"
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- Fecha del paquete -->
        <div class="flex flex-col gap-1">
          <label for="fecha" class="text-sm text-slate-500"> Fecha </label>
          <Calendar 
            id="fecha" name="fecha" placeholder="Seleccione la fecha del paquete"
            v-model="initialValues.fecha" showIcon 
            :manual-input="false" dateFormat="yy-mm-dd"      
            size="small" fluid :minDate="new Date()"/>
          <Message v-if="$form.fecha?.invalid" severity="error" size="small" variant="simple">
            {{ $form.fecha.error.message }}
          </Message>
        </div>

        <!-- Duracion 1 - 24 Hrs -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-slate-500">Duracion</label>
          <Select 
            id="duracion" name="duracion" placeholder="Seleccione la duracion del paquete (en horas)"
            v-model="initialValues.duracion"
            :options="DuracionesPaquete"
            size="small" fluid />
          <Message v-if="$form.duracion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.duracion.error.message }}
          </Message>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <!-- Descripcion paquete -->
        <label for="descripcion" class="text-sm text-slate-500">Descripcion</label>
        <Textarea 
          id="descripcion" name="descripcion" placeholder="Ingrese una descripcion para el paquete"
          v-model="initialValues.descripcion" rows="3" autoResize />
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
        </Message>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- Precio paquete -->
        <div class="flex flex-col gap-1">
          <label for="precio" class="text-sm text-slate-500">Precio</label>
          <InputNumber 
            id="precio" name="precio"
            v-model="initialValues.precio" :min="0"
            size="small" fluid />
          <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">
            {{ $form.precio.error.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <!-- Hora de salida -->
          <label for="salida" class="text-sm text-slate-500">Salida</label>
          <DatePicker 
              id="salida" name="salida"
              v-model="initialValues.salida"
              placeholder="Seleccione el horario de apertura"
              time-only :manual-input="false" hour-format="12"
              size="small" fluid />
          <Message v-if="$form.salida?.invalid" severity="error" size="small" variant="simple">
            {{ $form.salida.error.message }}
          </Message>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm text-slate-500">Atracciones Turísticas</label>
        <MultiSelect name="id_atracciones" v-model="initialValues.id_atracciones" :options="atraccionesOptions" optionLabel="nombre" optionValue="id" placeholder="Seleccione atracciones" display="chip" />
        <Message v-if="$form.id_atracciones?.invalid" severity="error" size="small" variant="simple">{{ $form.id_atracciones.error.message }}</Message>
      </div>

    </Form>
    <template #footer>
      <div class="flex gap-2">
        <Button
          type="submit" label="Guardar" severity="success" form="form_nuevo_paquete_turistico"
          fluid size="small"/>
        <Button 
          type="button" label="Cancelar" severity="danger"
          @click="visibleModalAgregarPaquete = false" fluid size="small" />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod'
import { server } from '~/server/server';

interface Props{ open: boolean }

const props = defineProps<Props>()
const visibleModalAgregarPaquete = ref(props.open)
const emit = defineEmits(['close'])
const atraccionesOptions = ref<any[]>([])
const DuracionesPaquete = ref([
  "1 hora", 
  "2 horas", 
  "3 horas",
  "4 horas", 
  "5 horas", 
  "6 horas",
  "7 horas", 
  "8 horas"
])

watch((visibleModalAgregarPaquete), newValue => {
  if( !newValue ){
    emit('close')
  }
})

const initialValues = reactive({
  categoria: '',
  nombre: '',
  fecha: null,
  descripcion: '',
  precio: 0,
  duracion: '',
  salida: new Date(),
  estado: true,
  id_agencia: 1,
  id_atracciones: [],
})

onMounted( async () => {
  try {
    const res: any = await $fetch( server.HOST + '/api/v1/atracciones-turisticas')
    atraccionesOptions.value = res.map((item: any) => ({ id: item.id, nombre: item.nombre }))
  } catch (error) {
    console.error('Error al cargar las atracciones turísticas:', error)
  }
})

const getSchema = () => z.object({})

const resolver = computed(() => zodResolver(getSchema()))

const handleGuardarPaquete = async () => {
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/paquetes-turisticos', {
      method: 'POST',
      body: initialValues
    })
    visibleModalAgregarPaquete.value = false
    initialValues.id_atracciones = []
    initialValues.fecha = null
  } catch (error) {
    console.error('Error al guardar el paquete turístico:', error)
  }
}
</script>