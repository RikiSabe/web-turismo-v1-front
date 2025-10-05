<template>
  <Drawer v-model:visible="visibleModalAgregarPaquete" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nuevo paquete turistico</span>
    </template>

    <Form
      v-slot="$form" class="flex flex-col gap-3" id="form_nuevo_paquete_turistico"
      @submit="handleGuardarPaquete"
      :resolver="resolver" :initialValues="initialValues">

      <div class="grid grid-cols-2 gap-3">
        <!-- Nombre paquete -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText
            id="nombre" name="nombre" placeholder="Ingrese el nombre del paquete"
            v-model="initialValues.nombre" size="small" fluid />
          <Message
            v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <div class="grid grid-cols-2 gap-1">
          <!-- Fecha del paquete -->
          <div class="flex flex-col gap-1">
            <label for="fecha" class="text-sm text-slate-500"> Fecha fin del paquete </label>
            <DatePicker
              id="fecha" name="fecha" placeholder="Seleccione la fecha del paquete"
              v-model="initialValues.fecha" showIcon :manual-input="false"
              dateFormat="yy-mm-dd" size="small" fluid :minDate="new Date()" lang="es" />
            <Message
              v-if="$form.fecha?.invalid" severity="error" size="small" variant="simple">
              {{ $form.fecha.error.message }}
            </Message>
          </div>
          
          <!-- Hora de salida -->
          <div class="flex flex-col gap-1">
            <label for="salida" class="text-sm text-slate-500">Hora de salida</label>
            <DatePicker
              id="salida" name="salida" v-model="initialValues.salida"
              placeholder="Seleccione el horario de apertura" time-only :manual-input="false"
              hour-format="12" size="small" fluid />
            <Message
              v-if="$form.salida?.invalid" severity="error" size="small" variant="simple">
              {{ $form.salida.error.message }}
            </Message>
          </div>

        </div>

      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- Selección de atracciones -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-slate-500">Atracciones Turísticas</label>
          <MultiSelect
            name="id_atracciones" v-model="initialValues.id_atracciones"
            :options="atraccionesOptions" optionLabel="nombre" optionValue="id"
            placeholder="Seleccione atracciones" display="chip" size="small" />
          <Message
            v-if="$form.id_atracciones?.invalid" severity="error" size="small" variant="simple">
            {{ $form.id_atracciones.error.message }}
          </Message>
        </div>

        <!-- Descripcion paquete -->
        <div class="flex flex-col gap-1">
          <label for="descripcion" class="text-sm text-slate-500">Descripcion</label>
          <Textarea
            id="descripcion" name="descripcion" placeholder="Ingrese una descripcion para el paquete"
            v-model="initialValues.descripcion" rows="3" autoResize />
          <Message
            v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.descripcion.error.message }}
          </Message>
        </div>
      </div>

      <!-- Configuracion de atracciones -->
      <div v-if="atraccionesSeleccionadas.length" class="mt-2">
        <h3 class="font-sm text-gray-700 mb-2"></h3>
        <Fieldset legend="Configuración de Atracciones">
          
          <div class="grid grid-cols-3 gap-3 mb-1">
            <span> Orden </span>
            <span class="text-center"> Nombre </span>
            <span class="text-end"> Duracion aproximada (en horas) </span>
          </div>
          
          <div class="flex flex-col gap-3">
            <div 
            v-for="(atr, index) in atraccionesSeleccionadas" :key="atr.id"
            class="grid grid-cols-3 gap-3 items-center ring-1 ring-slate-300 p-2 rounded-lg">
            
            <!-- Botones de orden -->
            <div class="flex gap-1">
              <Button 
              v-if="index !== 0" 
                icon="pi pi-arrow-up" size="small" outlined
                @click="moverArriba(index)" />
              <Button 
              v-if="index !== atraccionesSeleccionadas.length - 1" 
              icon="pi pi-arrow-down" size="small" outlined
              @click="moverAbajo(index)" />
            </div>
            
            <!-- Nombre -->
            <span class="font-medium text-gray-600 text-center"> {{ atr.nombre }} </span>
            
            <!-- Duración -->
            <div class="flex justify-end">
              <Dropdown 
              v-model="atraccionesSeleccionadas[index].duracion" class="w-30"
              :options="DuracionesLimitadas" placeholder="Duración" size="small"/>
            </div>
            
          </div>
        </div>
      </Fieldset>
      </div>
      
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button
          type="submit" label="Guardar" severity="success"
          form="form_nuevo_paquete_turistico" fluid size="small" />

        <Button
          type="button" label="Cancelar" severity="danger"
          @click="visibleModalAgregarPaquete = false" fluid size="small" />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { server } from '~/server/server'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const visibleModalAgregarPaquete = ref(props.open)
const emit = defineEmits(['close', 'update', 'success'])
const atraccionesOptions = ref<any[]>([])

// Duraciones limitadas
const DuracionesLimitadas = ref([1, 2, 3, 4])

// listado con las atracciones seleccionadas y su duración
const atraccionesSeleccionadas = ref<any[]>([])

watch(visibleModalAgregarPaquete, (newValue) => {
  if (!newValue) {
    emit('close')
  }
})

// valores iniciales
const initialValues = reactive({
  categoria: '',
  nombre: '',
  fecha: null as Date | null,
  descripcion: '',
  precio: 0,
  duracion: '',
  salida: new Date(),
  estado: true,
  id_agencia: 1,
  id_atracciones: [] as number[],
})

// cuando cambian las atracciones seleccionadas en el MultiSelect
watch(
  () => initialValues.id_atracciones,
  (ids) => {
    atraccionesSeleccionadas.value = ids.map((id: number) => {
      const atr = atraccionesOptions.value.find((a) => a.id === id)
      const existente = atraccionesSeleccionadas.value.find((a) => a.id === id)
      return {
        id: atr.id,
        nombre: atr.nombre,
        duracion: existente?.duracion || '1 hora',
      }
    })
  }
)

onMounted(async () => {
  try {
    const res: any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas')
    atraccionesOptions.value = res.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
    }))
  } catch (error) {
    console.error('Error al cargar las atracciones turísticas:', error)
  }
})

function moverArriba(index: number) {
  if (index > 0) {
    const temp = atraccionesSeleccionadas.value[index]
    atraccionesSeleccionadas.value.splice(index, 1)
    atraccionesSeleccionadas.value.splice(index - 1, 0, temp)
  }
}

function moverAbajo(index: number) {
  if (index < atraccionesSeleccionadas.value.length - 1) {
    const temp = atraccionesSeleccionadas.value[index]
    atraccionesSeleccionadas.value.splice(index, 1)
    atraccionesSeleccionadas.value.splice(index + 1, 0, temp)
  }
}

const getSchema = () => z.object({})

const resolver = computed(() => zodResolver(getSchema()))

const handleGuardarPaquete = async () => {
  // try {
  //   await $fetch(server.HOST + '/api/v1/paquetes-turisticos', {
  //     method: 'POST',
  //     body: {
  //       ...initialValues,
  //       atracciones: atraccionesSeleccionadas.value, // mandamos id + duracion
  //     },
  //   })
  //   // reset ()
  //   visibleModalAgregarPaquete.value = false
  //   initialValues.id_atracciones = []
  //   initialValues.fecha = null
  //   emit('success')
  //   emit('update')
  // } catch (error) {
  //   console.error('Error al guardar el paquete turístico:', error)
  // }
}
</script>
