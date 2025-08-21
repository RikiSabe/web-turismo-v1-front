<template>
  <Drawer v-model:visible="visibleModal" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Modificar agencia</span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-4" id="form_modificar_agencia"
      :initialValues="initialValues" :resolver="resolver" 
      @submit="onFormSubmit" >
      
      <div class="grid grid-cols-2 gap-2">
        <!-- Nombre agencia -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre" placeholder="Ingrese el nombre de la agencia"
            v-model="initialValues.nombre"
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <!-- Telefono agencia -->
        <div class="flex flex-col gap-1">
          <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
          <InputText 
            id="telefono" name="telefono" placeholder="Ingrese el telefono de la agencia"
            v-model="initialValues.telefono"
            size="small" fluid />
          <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
            {{ $form.telefono.error.message }}
          </Message>
        </div>

        <!-- Correo Electronico agencia -->
        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText 
            id="correo" name="correo" placeholder="Ingrese el correo electronico de la agencia"
            v-model="initialValues.correo"
            size="small" fluid />
          <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
            {{ $form.correo.error.message }}
          </Message>
        </div>

        <!-- Encargado agencia -->
        <div class="flex flex-col gap-1">
          <label for="encargado" class="text-sm text-slate-500"> Encargado de la Agencia</label>
          <Select 
            id="encargado" name="encargado"
            placeholder="Seleccione el usuario que será encargado"
            v-model="initialValues.id_encargado" :options="Encargados"
            option-label="nombre_completo" option-value="id" checkmark size="small" />
          <Message v-if="$form.encargado?.invalid" severity="error" size="small" variant="simple">
            {{ $form.encargado.error.message }}
          </Message>
        </div>
      </div>

      <!-- Descripcion agencia -->
      <div class="flex flex-col gap-1">
        <label for="descripcion" class="text-sm text-slate-500"> Descripción </label>
        <InputText 
          id="descripcion" name="descripcion" placeholder="Ingrese la descripcion de la agencia"
          v-model="initialValues.descripcion" 
          size="small" fluid />
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
        </Message>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Departamento agencia -->
        <div class="flex flex-col gap-1">
          <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
          <Select 
            id="departamento" name="departamento"
            placeholder="Seleccione el departamento donde se encuentra la agencia"
            v-model="initialValues.id_departamento" :options="Departamentos" 
            optionLabel="nombre" optionValue="id" checkmark size="small"/>
          <Message v-if="$form.departamento?.invalid" severity="error" size="small" variant="simple">
            {{ $form.departamento.error.message }}
          </Message>
        </div>

        <!-- Direccion escrita agencia -->
        <div class="flex flex-col gap-1">
          <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
          <InputText 
            id="direccion" name="direccion" placeholder="Ingrese la direccion escrita de la agencia"
            v-model="initialValues.direccion" aria-describedby="direccion-help" 
            size="small" fluid/>
          <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
            {{ $form.direccion.error.message }}
          </Message>
        </div>

        <!-- Falta agencia -->
         <div class="flex flex-col gap-1">
            <label for="estado" class="text-sm text-slate-500"> Estado </label>
            <Select
              id="estado" name="estado"
              placeholder="Seleccione el estado de la agencia"
              v-model="selectEstado" :options="Estados"
              optionValue="valor" optionLabel="nombre"
              size="small" fluid/>
         </div>
      </div>

      <div v-if="FotosExistentes.length">
        <label class="text-sm text-slate-500"> Fotos Actuales (puede cambiar las fotos y su orden volviendo a cargar las imagenes)</label>
        <label class="text-sm text-slate-500"> Si no desea hacer cambios, deje en blanco </label>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(foto, index) in FotosExistentes" :key="foto.id" 
            class="relative object-contain w-56 h-36 rounded overflow-hidden">
            <img :src="foto.foto" class="object-cover w-full h-full" />
          </div>
        </div>
      </div>

      <div>
        <FileUpload
          choose-label="Elegir Imagenes" cancel-label="Eliminar todas las fotos" 
          ref="fotos" :show-upload-button="false" class="p-button-outlined"
          accept="image/*" :multiple="true" 
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
          label="Guardar" type="submit" 
          form="form_modificar_agencia"
          size="small" fluid />
        <Button 
          label="Cancelar" type="button"  
          severity="danger" size="small"
          @click="visibleModal = false" fluid />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';
import { z } from 'zod';
import { server } from '~/server/server';

interface Props { open: boolean, id: number }
const props = defineProps<Props>()
const emit = defineEmits(['hidden', 'refreshList', 'modified', 'error'])
const visibleModal = ref(props.open)
const $primevue = usePrimeVue()
const Departamentos = ref<any[]>([])
const Encargados = ref<any[]>([])

const Imagenes = ref<File[]>([])
const FotosExistentes = ref<any[]>([])

const selectEstado = ref()
const Estados = ref([
  { nombre: 'Activo', valor: true },
  { nombre: 'Inactivo', valor: false },
])

const initialValues = reactive({
  nombre: '', direccion: '',
  telefono: '', correo: '',
  descripcion: '', id_encargado: '',
  id_departamento: '',
  estado: "true",
})

onMounted( async () => {
  await obtenerAgencia()
  await obtenerDepartamentos()
  await obtenerEncargados()
})

async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos',{
    method: 'GET'
  })
  Departamentos.value = res
}

async function obtenerEncargados() {
  const res: any[] = await $fetch(server.HOST + '/api/v1/usuarios', {
    method: 'GET'
  })
  Encargados.value = res.map( item => ({ 
    nombre_completo: item.nombre + ' ' + item.apellido_paterno, 
    id: item.id 
  }))
}

watch(visibleModal, (newVal) => { 
  if( !newVal ) emit('hidden') 
})

async function obtenerAgencia() {
  const res: any = await $fetch(server.HOST + '/api/v1/agencias/' + props.id, {
    method: 'GET'
  }) 
  console.log(res)
  initialValues.nombre = res.nombre
  initialValues.telefono = res.telefono
  initialValues.correo = res.correo
  initialValues.id_encargado = res.id_encargado
  initialValues.descripcion = res.descripcion
  initialValues.id_departamento = res.id_departamento
  initialValues.direccion = res.direccion
  selectEstado.value = res.estado

  if (res.fotos && res.fotos.length > 0) {
    FotosExistentes.value = res.fotos
      .sort((a: any, b: any) => a.orden - b.orden)
      .map((foto: any, index: number) => ({
        ...foto,
        file: base64ToFile(foto.foto, `foto_${foto.id}.jpg`)
      }));
  }
}

function base64ToFile(base64: string, filename: string): File | null {
  try {
    if (!base64 || !base64.startsWith("data:image/")) return null;

    const parts = base64.split(",");
    if (parts.length !== 2) return null;

    const mimeMatch = parts[0].match(/:(.*?);/);
    if (!mimeMatch) return null;

    const mime = mimeMatch[1];
    const bstr = atob(parts[1]); // aquí puede fallar
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("base64ToFile error:", error);
    return null;
  }
}

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

const renombrarFotosExistentes = () => {
  FotosExistentes.value = FotosExistentes.value.map((foto, i) => {
    const extension = obtenerExtension(foto.file.name)
    const nuevoNombre = `${i + 1}${extension}`
    return {
      ...foto,
      file: new File([foto.file], nuevoNombre, { type: foto.file.type })
    }
  })
}


const getSchema = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

  telefono: z.string()
    .regex(/^\d{8}$/, { message: 'El teléfono debe tener exactamente 8 dígitos numéricos.' }),

  correo: z.string()
    .email({ message: 'Ingrese un correo electrónico válido.' }),

  encargado: z.number({
    required_error: 'Seleccione un encargado.',
  }),

  descripcion: z.string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),

  departamento: z.number({
    required_error: 'Seleccione un departamento.',
  }),

  direccion: z.string()
    .min(5, { message: 'La dirección es requerida y debe tener al menos 5 caracteres.' }),
})

const resolver = computed( () => zodResolver(getSchema()))

const onFormSubmit = async ({valid} : any) => {
  const formData = new FormData()
  if( valid ){
    for(const [key, data] of Object.entries(initialValues)){
      formData.append(key, data)
      console.log(key, data)
    }

    if( Imagenes.value.length === 0 ){
      renombrarFotosExistentes()
      for(const foto of FotosExistentes.value){
        formData.append('fotos[]', foto.file)
        console.log('foto:', foto.file.name)
      }
    } else {
      renombrarImagenes()
      for(const foto of Imagenes.value){
        formData.append('fotos[]', foto)
        console.log('foto:', foto.name)
      }
    }
    try {
      await $fetch(server.HOST + '/api/v1/agencias/' + props.id, {
        method: 'PUT',
        body: formData
      })
      emit('modified'), emit('refreshList')
      visibleModal.value = false
    } catch( err ){
      console.error(err)
      emit('error')
    }
  }  
}
</script>