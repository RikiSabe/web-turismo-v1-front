<template>
  <Drawer v-model:visible="visibleModal" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap"> Modificar Atracción Turistica </span>
    </template>
    <Form 
      v-slot="$form" class="flex flex-col gap-2" id="form_modificar_at"
      @submit="onFormSubmit" :resolver="resolver"
      :initialValues="initialValues">

      <div class="grid grid-cols-2 gap-2">
        <!-- Nombre nueva atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre"
            placeholder="Ingrese el nombre"
            v-model="initialValues.nombre"
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <!-- Tipo nueva atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="tipo" class="text-sm text-slate-500"> Tipo </label>
          <Select 
            id="tipo" name="tipo"
            :options="TiposAtracciones" v-model="selectTipoAtraccion" 
            placeholder="Seleccione el tipo" 
            size="small" fluid/>
          <Message v-if="$form.tipo?.invalid" severity="error" size="small" variant="simple">
            {{ $form.tipo.error.message }}
          </Message>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Horario apertura atraccion turistica -->
          <div class="flex flex-col gap-1">
            <label for="horario_apertura" class="text-sm text-slate-500"> Horario de Apertura</label>
            <DatePicker 
              id="horario_apertura" name="horario_apertura"
              v-model="selectHorarioApertura"
              placeholder="Seleccione el horario de apertura"
              time-only :manual-input="false" hour-format="12"
              size="small" fluid />
            <Message v-if="$form.horario_apertura?.invalid" severity="error" size="small" variant="simple">
              {{ $form.horario_apertura.error.message }}
            </Message>
          </div>

          <!-- Horario cierre atraccion turistica -->
          <div class="flex flex-col gap-1">
            <label for="horario_cierre" class="text-sm text-slate-500"> Horarios de Cierre </label>
            <DatePicker 
              id="horario_cierre" name="horario_cierre"
              v-model="selectHorarioCierre"
              placeholder="Seleccione el horario de cierre"
              time-only :manual-input="false" hour-format="12"
              size="small" fluid />
            <Message v-if="$form.horario_cierre?.invalid" severity="error" size="small" variant="simple">
              {{ $form.horario_cierre.error.message }}
            </Message>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Precio atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="precio" class="text-sm text-slate-500"> Precio </label>
          <InputText
            id="precio" name="precio" 
            type="number" :min="0"
            v-model="initialValues.precio" 
            placeholder="Ingrese el precio"
            size="small" fluid />
          <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">
            {{ $form.precio.error.message }}
          </Message>
        </div>

        <!-- Ubicacion atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="ubicacion" class="text-sm text-slate-500"> Direccion </label>
          <InputText 
            id="ubicacion" name="ubicacion" 
            v-model="initialValues.ubicacion" 
            placeholder="Ingrese la direccion escrita"
            size="small" fluid/>
          <Message v-if="$form.ubicacion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.ubicacion.error.message }}
          </Message>
        </div>

        <!-- Departamento nueva atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
          <Select 
            id="departamento" name="departamento" 
            placeholder="Seleccione el departamento donde se encuentra atraccion turistica"
            v-model="id_departamento" :options="Departamentos"
            optionLabel="nombre" optionValue="id" checkmark size="small"/>
          <Message v-if="$form.departamento?.invalid" severity="error" size="small" variant="simple">
            {{ $form.departamento.error.message }}
          </Message>
        </div>

        <!-- Provincia nueva atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label v-if="Provincias.length" for="provincia" class="text-sm text-slate-500" > Provincia </label>
          <Select
            placeholder="Seleccione la provincia donde se encuentra la atraccion turistica"
            id="provincia" v-if="Provincias.length" name="provincia"
            v-model="id_ubicacion" :options="Provincias"
            optionLabel="nombre" optionValue="id" checkmark size="small" />
          <Message v-if="$form.provincia?.invalid" severity="error" size="small" variant="simple">
            {{ $form.provincia.error.message }}
          </Message>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Descripcion atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="descripcion" class="text-sm text-slate-500"> Descripcion </label>
          <InputText 
            id="descripcion" name="descripcion" 
            v-model="initialValues.descripcion" 
            placeholder="Ingrese una pequeña descripción de atracción turistica"
            size="small" fluid/>
          <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.descripcion.error.message }}
          </Message>
        </div>

        <!-- Estado -->
         <div class="flex flex-col gap-1">
          <label for="estado" class="text-sm text-slate-500"> Estado </label>
          <Select 
            id="estado" name="estado"
            v-model="selectEstado" :options="Estados"
            optionValue="valor" optionLabel="nombre"
            size="small" fluid/>
         </div>
      </div>

      <div>
        <FileUpload
          choose-label="Elegir Imagenes" cancel-label="Eliminar todas las fotos" 
          ref="fotos" :show-upload-button="false" class="p-button-outlined"
          accept="image/*" :multiple="true" >
          <template #empty>
            <p> Seleccione las imagenes aqui </p>
          </template>
        </FileUpload>
      </div>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button 
          label="Guardar" severity="success" type="submit" form="form_modificar_at"
          size="small" fluid />
        <Button 
          label="Cancelar" type="button" severity="danger" size="small"
          @click="visibleModal = false" fluid />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod'
import { server } from '~/server/server';

interface Props { open: boolean, id: number }
const props = defineProps<Props>()
const emit = defineEmits(['hidden', 'refreshList', 'modified'])
const visibleModal = ref(props.open)
const TiposAtracciones = ref(['Naturales', 'Culturales', 'Enoturismo', 'Eventos'])
const selectTipoAtraccion = ref()
const selectHorarioApertura = ref(), selectHorarioCierre = ref()

const Departamentos = ref<any[]>([]), id_departamento = ref()
const Provincias = ref<any[]>([]), id_ubicacion = ref()
const fotos = ref<any>(null)

const selectEstado = ref()
const Estados = ref([
  { nombre: 'Activo', valor: true },
  { nombre: 'Inactivo', valor: false },
])

const initialValues = reactive({
  tipo : selectTipoAtraccion, nombre: '', 
  ubicacion: '', descripcion: '', 
  horario_apertura: selectHorarioApertura, horario_cierre: selectHorarioCierre, 
  precio: '', estado: true,
})

onMounted( async () => {
  await obtenerAtraccionTuristica(), obtenerDepartamentos()
})


async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos')
  Departamentos.value = res
}

watch(id_departamento, async (newValue) => {
  id_ubicacion.value = null
  if( newValue != null ){
    await obtenerProvincias(newValue)
  } else {
    Provincias.value = []
  }
})

async function obtenerProvincias(id : any) {
  const res: any[] = await $fetch(server.HOST + '/api/v1/provincias/' + id)
  Provincias.value = res
}

watch(visibleModal, (newVal) => { 
  if( !newVal ) emit('hidden') 
})

async function obtenerAtraccionTuristica() {
  // code
}

const getSchema = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

  tipo: z.string()
    .refine(val => TiposAtracciones.value.includes(val), { message: 'Seleccione un tipo valido.'}),
  
  horario_apertura: z.date({
    required_error: 'Seleccione el horario de apertura.'
  }),

  horario_cierre: z.date({
    required_error: 'Seleccione el horario de cierre.'
  }),

  precio: z.string()
    .regex(/^\d+$/, { message: 'El precio debe ser numérico.' })
    .transform(Number)
    .refine(val => (val >= 0), { message: 'El precio no puede ser negativo.' }),

  ubicacion: z.string()
    .min(5, { message: 'La dirección es requerida y debe tener al menos 5 caracteres.' }),
  
  departamento: z.number({
    required_error: 'Seleccione un departamento.'
  }),

  provincia: z.number({
    required_error: 'Seleccione una provincia.'
  }),

  descripcion: z.string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
})

const resolver = computed( () => zodResolver(getSchema()))

const onFormSubmit = async ( {valid} : any ) => {
  // code
}
</script>