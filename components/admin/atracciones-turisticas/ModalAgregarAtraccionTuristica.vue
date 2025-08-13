<template>
  <Drawer v-model:visible="visibleNuevaAtraccionTuristica" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap"> Agregar nueva atraccion turistica </span>
    </template>
    <Form 
      v-slot="$form" class="flex flex-col gap-2" id="form_nueva_at"
      @submit="onFormSubmit" :resolver="resolver"
      :initialValues="initialValues">

      <div class="grid grid-cols-2 gap-2">
        <!-- Nombre nueva atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre"
            placeholder="Ingrese el nombre de la nueva atraccion turistica"
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
            placeholder="Seleccione el tipo de la nueva atraccion turistica" 
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

        <!-- Encargado atraccion turistica -->
        <div class="flex flex-col gap-1">
          <label for="encargado" class="text-sm text-slate-500"> Encargado (solo se listaran los encargados de turismo) </label>
          <Select 
            id="encargado" name="encargado"
            placeholder="Seleccione un encargado"
            :options="Encargados" optionLabel="nombre" optionValue="id"
            v-model="id_encargado"
          size="small" fluid>
          <template #empty>
            <span> Sin encargados </span>
          </template>
        </Select>
          <Message v-if="$form.encargado?.invalid" severity="error" size="small" variant="simple">
              {{ $form.encargado.error.message }}
            </Message>
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
            placeholder="Ingrese el precio de la nueva atraccion turistica"
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
            v-model="initialValues.direcion" 
            placeholder="Ingrese la direccion escrita de la nueva atraccion turistica"
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
            placeholder="Seleccione el departamento donde se encuentra la nueva atraccion turistica"
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

      <!-- Descripcion atraccion turistica -->
      <div class="flex flex-col gap-1">
        <label for="descripcion" class="text-sm text-slate-500"> Descripcion </label>
        <InputText 
          id="descripcion" name="descripcion" 
          v-model="initialValues.descripcion" 
          placeholder="Ingrese una pequeña descripción de la nueva atracción turistica"
          size="small" fluid/>
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
        </Message>
      </div>

      <!-- Fotos atraccion turistica -->
      <div>
        <label for="uploadimagenes" class="text-sm text-slate-500"> Imagenes </label>
        <FileUpload
          id="uploadimagenes" accept="image/*" :multiple="true"
          choose-label="Elegir Imagenes" cancel-label="Eliminar todas las fotos" 
          ref="fotos" :show-upload-button="false" class="p-button-outlined"
          @select="onSelectImages" @clear="onClearImages" @remove="onRemoveImages">
          <template #empty>
            <p> Seleccione las imagenes aqui </p>
          </template>
          <template #content="{ files, removeFileCallback }">
            <div class="flex flex-col gap-1">
              <div v-if="files.length > 0">
                <div class="flex flex-wrap gap-1">
                  <div v-for="(file, index) in files" :key="index" class="p-2 rounded-border flex flex-col shadow rounded-lg items-center gap-2">
                    <div>
                      <img role="presentation" :alt="file.name" :src="obtenerPreview(file)" class="w-40 h-32 rounded-lg" />
                    </div>
                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                    <div>{{ formatSize(file.size) }}</div>
                    <Button 
                      icon="pi pi-times" variant="outlined" rounded severity="danger"
                      @click="onRemoveTemplatingFile(file, removeFileCallback, index)" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </FileUpload>
      </div>

      <!-- Orden Fotos atraccion turistica -->
      <span v-if="Imagenes.length" class="text-sm text-slate-500"> 
        Orden de las Fotos (se mostrarán horizontalmente, considere seleccionar fotos con este formato) 
      </span>
      <div v-if="Imagenes.length" class="flex flex-wrap gap-2">
        <div
          v-for="(foto, index) in Imagenes" :key="index" 
          class="relative object-contain w-56 h-36 rounded overflow-hidden">
          <img :src="obtenerPreview(foto)" class="object-cover w-full h-full" />
          <div class="absolute bottom-1 left-1 flex gap-1">
            <Button 
              icon="pi pi-arrow-left" text size="small" 
              @click="moverIzquierda(index)" :disabled="index === 0" />
            <Button 
              icon="pi pi-arrow-right" text size="small" 
              @click="moverDerecha(index)" :disabled="index === Imagenes.length - 1" />
          </div>
        </div>
      </div>
      <span v-if="Imagenes.length" class="text-sm text-slate-500">
        Las fotos no mantendrán su nombre de origen.
      </span>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button 
          label="Guardar" severity="success" type="submit" form="form_nueva_at"
          size="small" fluid />
        <Button 
          label="Cancelar" type="button" severity="danger" size="small"
          @click="visibleNuevaAtraccionTuristica = false" fluid />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { server } from '~/server/server';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';
import { formatoHora12 } from '~/utils/utils';

interface Props { open: boolean }

const props = defineProps<Props>()
const emit = defineEmits(['close', 'success', 'fail', 'update'])
const visibleNuevaAtraccionTuristica = ref(props.open)
const TiposAtracciones = ref(['Naturales', 'Culturales', 'Enoturismo', 'Eventos'])
const selectTipoAtraccion = ref()
const selectHorarioApertura = ref<Date | null>(null), selectHorarioCierre = ref<Date |null>(null)

const Encargados = ref<any[]>([]), id_encargado = ref()

const Departamentos = ref<any[]>([]), id_departamento = ref()
const Provincias = ref<any[]>([]), id_ubicacion = ref()

const fotos = ref<any>(null)
const $primevue = usePrimeVue()

const AtraccionesExistentes = ref<any[]>([])

const initialValues = reactive({
  id_encargado: id_encargado,
  id_ubicacion: id_ubicacion,
  categoria : selectTipoAtraccion, 
  nombre: '',
  direcion: '',
  descripcion: '', 
  horario_apertura: selectHorarioApertura, 
  horario_cierre: selectHorarioCierre, 
  precio: ''
})

onMounted( async () => {
  await obtenerDepartamentos()
  await obtenerEncargados()
  // Horario de entrada 
  const entradageneral = new Date()
  entradageneral.setHours(7,0,0,0)
  selectHorarioApertura.value = new Date(entradageneral)
  // Horario de cierre
  const cierregeneral = new Date()
  cierregeneral.setHours(20,0,0,0)
  selectHorarioCierre.value = new Date(cierregeneral)
  await ObtenerAtraccionesExistentes()
})

async function ObtenerAtraccionesExistentes(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/atracciones-turisticas/existentes', {
    method: 'GET'
  })
  AtraccionesExistentes.value = res.map( (item) => {
    return {
      ...item,
      nombre: item.nombre.replace(/\s+/g, ' ').trim()
    }
  })
  console.log(JSON.stringify(AtraccionesExistentes, null,2))
}

async function obtenerEncargados(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/usuarios', {
    method: 'GET'
  })
  Encargados.value = res
    .filter( (item:any) => item.rol === "encargado de turismo")
    .map( (item:any) => ({ id : item.id, nombre: item.nombre + " " + item.apellido_paterno }))
}
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

watch(visibleNuevaAtraccionTuristica, (newValue) => {
  if(!newValue){ emit('close') }
})

const Imagenes = ref<File[]>([])
const onSelectImages = (event: FileUploadSelectEvent) => {
  Imagenes.value = []
  Imagenes.value.push( ...event.files)
}

const onClearImages = () => {
  Imagenes.value = []
}

const onRemoveImages = (event: FileUploadRemoveEvent) => {
  const index = Imagenes.value.findIndex( f => f.name === event.file.name  && f.size === event.file.size )
  if( index !== -1 ){
    Imagenes.value.splice(index, 1)
  }
}

const obtenerPreview = (archivo: File) => {
  return URL.createObjectURL(archivo)
}

function moverIzquierda(index: number) {
  if (index > 0) {
    const temp = Imagenes.value[index - 1]
    Imagenes.value[index - 1] = Imagenes.value[index]
    Imagenes.value[index] = temp
  }
}

function moverDerecha(index: number) {
  if (index < Imagenes.value.length - 1) {
    const temp = Imagenes.value[index + 1]
    Imagenes.value[index + 1] = Imagenes.value[index]
    Imagenes.value[index] = temp
  }
}

const obtenerExtension = (nombre: string): string => {
  const match = nombre.match(/\.[0-9a-z]+$/i)
  return match ? match[0] : ''
}

const renombrarImagenes = () => {
  Imagenes.value = Imagenes.value.map((file, i) => {
    const nuevoNombre = `${i + 1}${obtenerExtension(file.name)}`
    return new File([file], nuevoNombre, { type: file.type })
  })
}

const onRemoveTemplatingFile = (file: File, removeFileCallback: any, index : number) => {
  removeFileCallback(index)
}

const formatSize = (bytes : any) => {
  const k = 1024
  const dm = 3
  const sizes = $primevue?.config?.locale?.fileSizeTypes ?? ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
      return `0 ${sizes[0]}`
  }
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  return `${formattedSize} ${sizes[i]}`
}

const getSchema = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' })
    .refine( 
      value => {
        return !AtraccionesExistentes.value.some(e => e.nombre?.toLowerCase() === value.toLowerCase())
      }, { message: 'Atraccion Turistica ya registrada, por favor utilice otro nombre'} 
    ),

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

const onFormSubmit = async( {valid} : any ) => {
  const formData = new FormData()

  if( valid ){
    renombrarImagenes()
    try {
      for(const [key, data] of Object.entries(initialValues)) {
        if( key === "horario_apertura" ){
          formData.append('horario_apertura', formatoHora12(data))
          continue
        }
        if( key === "horario_cierre" ){
          formData.append('horario_cierre', formatoHora12(data))
          continue
        }
        formData.append(key, data);
      }
      if( Imagenes.value.length === 0 ){
        formData.append('fotos[]', "N/A")
      } else {
        for(const foto of Imagenes.value){
          formData.append('fotos[]', foto)
        }
      }
      await $fetch(server.HOST + '/api/v2/atracciones-turisticas' , {
        method: 'POST',
        body: formData
      })
      emit('success'), emit('update'), emit('close')
    } catch (err) {
      console.error(err)
      emit('fail')
    }
  }
}
</script>