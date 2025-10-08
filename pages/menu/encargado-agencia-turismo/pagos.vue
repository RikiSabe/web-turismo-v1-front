<template>
  <Toast />
  <p class="text-center text-2xl font-bold text-slate-800 m-4"> Comprobante de Pago</p> 
  <section class="flex flex-col gap-2 items-center justify-center h-96">
    <div class="flex flex-col gap-2">
      <p v-if="!src" class="text-center text-slate-500"> 
        Seleccione una imagen QR para las reservas de los paquetes 
      </p>
      <div class="card flex flex-col items-center gap-2 mb-2">
        <FileUpload
          v-if="!src" customUpload auto chooseLabel="Elegir Imagen"
          mode="basic" severity="secondary" class="p-button-outlined" accept="image/*"
          @select="onFileSelect" />
        <span v-if="src" class="text-sm text-slate-500 p-4"> Imagen Seleccionada </span>
        <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full sm:w-80" />
        <p v-else class="text-center text-slate-500"> No hay QR seleccionado </p>
        <Button 
          v-if="src" label="Eliminar Imagen" size="small"
          severity="danger" variant="outlined" fluid
          @click="removeFile" />
        <Button 
          v-if="src && file" label="Guardar Cambios" 
          size="small" variant="outlined" fluid
          @click="handleSave"/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { server } from '~/server/server'

definePageMeta({ layout: 'menu-encargado-agencia-turismo' })

const toast = useToast()
const src = ref<string | null>(null)
const file = ref<File | null>(null)

function onFileSelect(event: any) {
  const selectedFile = event.files[0]
  if (!selectedFile) return
  src.value = URL.createObjectURL(selectedFile)
  file.value = selectedFile
}

function removeFile() {
  src.value = null
  file.value = null
}

onMounted(async () => {
  await obtenerQR()
})

async function obtenerQR() {
  try {
    const id_encargado = sessionStorage.getItem('id')
    if (!id_encargado) return

    const res: any = await $fetch(server.HOST + '/api/v1/encargado-qr/' + id_encargado, {
      method: 'GET'
    })

    src.value = res.foto || null
  } catch (err) {
    console.error('Error al obtener QR:', err)
  }
}

async function handleSave() {
  try {
    if (!file.value) return
    const id_encargado = sessionStorage.getItem('id')
    if (!id_encargado) return

    const formData = new FormData()
    formData.append('QR', file.value)

    await $fetch(server.HOST + '/api/v1/encargado-qr/' + id_encargado, {
      method: 'POST',
      body: formData
    })

    toast.add({ severity: 'success', detail: 'QR actualizado', life: 3000 })
    await obtenerQR()
    file.value = null
  } catch (err) {
    console.error('Error al guardar QR:', err)
    toast.add({ severity: 'error', detail: 'Error al guardar QR', life: 3000 })
  }
}
</script>
