<template>
  <section class="flex flex-col gap-2 items-center justify-center h-96">
    <div class="flex flex-col gap-2">
      <p v-if="!src" class="text-center text-slate-500"> Seleccione una imagen para foto de perfil </p>
      <div class="card flex flex-col items-center gap-2 mb-2">
        <FileUpload
          v-if="!src" customUpload auto chooseLabel="Elegir Imagen"
          mode="basic" severity="secondary" class="p-button-outlined" accept="image/*"
          @select="onFileSelect" />
        <span v-if="src" class="text-sm text-slate-500"> Imagen Seleccionada </span>
        <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full sm:w-80" />
        <p v-else class="text-center text-slate-500"> No hay imagen seleccionada </p>
        <Button 
          v-if="src" label="Eliminar Imagen" 
          severity="danger" variant="outlined" 
          @click="removeFile()" />
      </div>
    </div>
  </section>
  <div class="flex pt-6 justify-between">
    <Button 
      type="button" label="Volver" severity="secondary" 
      icon="pi pi-arrow-left" @click="emit('return')" />
    <Button 
      label="Guardar" 
      icon="pi pi-check" iconPos="right" 
      @click="emit('submited')" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modalPhoto : any }>()
const emit = defineEmits(['update:modelPhoto', 'submited', 'return'])

const src = ref<string | null>(props.modalPhoto ? URL.createObjectURL(props.modalPhoto) : null)
const file = ref<File | null>(props.modalPhoto || null)

function onFileSelect(event: any) {
  const selectedFile = event.files[0]
  if(!selectedFile) return
  src.value = URL.createObjectURL(selectedFile)
  file.value = selectedFile
  emit('update:modelPhoto', file.value)
}

function removeFile(){
  src.value = null
  file.value = null
  emit('update:modelPhoto', null)
}

</script>