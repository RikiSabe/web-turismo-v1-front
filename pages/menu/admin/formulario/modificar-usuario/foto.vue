<template>
  <p class="text-center text-2xl text-slate-600 font-semibold mt-8 mb-8"> Modificar Foto </p>
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
    <div class="grid grid-cols-2 gap-2 pt-2 w-96">
      <Button 
        type="button" label="Cancelar" severity="danger"
        @click="router.back()" fluid />
      <Button 
        label="Guardar" fluid
        @click="handleChange" />
    </div>
  </section>
</template>


<script setup lang="ts">
import { server } from '~/server/server'

const router = useRouter()
const route = useRoute()
const id_usuario = route.query.id

const src = ref<string | null>(null) // URL.createObjectURL(props.modalPhoto)
const file = ref<File | null>(null)

onMounted( async () => {
  await obtenerFotoUsuario()
})

async function obtenerFotoUsuario(){
  try {
    const res :any = await $fetch(server.HOST + '/api/v1/usuarios/foto/' + id_usuario , {
      method: 'GET'
    })
    console.log(JSON.stringify(res, null, 2))
    src.value = res.foto
  } catch (err) {
    console.error(err)
  }
}

function onFileSelect(event: any) {
  const selectedFile = event.files[0]
  if(!selectedFile) return
  src.value = URL.createObjectURL(selectedFile)
  file.value = selectedFile
}

function removeFile(){
  src.value = null
  file.value = null
}

async function handleChange() {
  // submit
}
</script>
