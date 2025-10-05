<template>
  <div>
    <label for="uploadimagenes" class="text-sm text-slate-500"> Imagenes </label>
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
  <div class="flex pt-6 justify-between">
    <Button 
      label="Volver" severity="secondary" 
      icon="pi pi-arrow-left" @click="emit('return')" />
    <Button label="Guardar" @click="onSave()" />
  </div>
</template>

<script setup lang="ts">
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';
const $primevue = usePrimeVue()

const props = defineProps<{ modalPhoto : File[] }>() 
const emit = defineEmits(['update:modelPhoto', 'submited', 'return'])

const obtenerPreview = (archivo: File) => {
  return URL.createObjectURL(archivo)
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

const Imagenes = ref<File[]>(props.modalPhoto)
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

const onSave = () => {
  renombrarImagenes()
  emit('update:modelPhoto', Imagenes.value)
  emit('submited')
}

</script>