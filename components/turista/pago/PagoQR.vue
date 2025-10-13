<template>
  <Dialog 
    v-model:visible="visible" modal header="Pago por QR a Reserva" 
    :style="{ width: '40rem' }">
    <p class="text-center"> Realice el pago por el siguiente QR </p>
    <div class="flex justify-center">
      <img :src="QR" alt="qr" class="h-60 w-60" />
    </div>
    <p class="text-center text-slate-500"> Suba su comprobante aqui </p>
    <div class="card flex flex-col items-center gap-2 mb-2">
      <FileUpload
        v-if="!src" customUpload auto chooseLabel="Elegir Imagen"
        mode="basic" severity="secondary" class="p-button-outlined" accept="image/*"
        @select="onFileSelect" />
      <span v-if="src" class="text-sm text-slate-500 p-4"> Imagen Seleccionada </span>
      <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-60 h-60" />
      <p v-else class="text-center text-slate-500"> No hay un comprobante seleccionado </p>
      <Button 
        v-if="src" label="Eliminar Imagen" size="small"
        severity="danger" variant="outlined" fluid
        @click="removeFile" />
      <Button 
        v-if="src && file" label="Subir Comprobante" 
        size="small" variant="outlined" fluid
        @click="handleSave"/>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { server } from '~/server/server';

interface Props{
  open: boolean, id_encargado: number, id_reserva: number
}
const props = defineProps<Props>()
const emit = defineEmits(['ok', 'close'])
const visible = ref(props.open)
const QR = ref<any>(null)

const src = ref<string | null>(null)
const file = ref<File | null>(null)

watch(visible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

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

onMounted( async () => {
  try {
    const qr:any = await $fetch(server.HOST + '/api/v1/encargado-qr/' + props.id_encargado, {
      method: 'GET'
    })
    QR.value = qr.foto
  } catch (err) {
    console.error(err)
  }
})

async function handleSave() {
  try {
    const id_usuario = Number(sessionStorage.getItem('id'))
    const formData = new FormData()
    if (file.value) {
      formData.append('comprobante', file.value)
    } else {
      throw new Error('No file selected')
    }
    await $fetch(server.HOST + '/api/v1/pagos/comprobante/' + id_usuario + '/' + props.id_reserva , {
      method: 'POST',
      body: formData
    })
    emit('ok'), emit('close')
    visible.value = false
  } catch (err) {
    console.error(err)
  }
}
</script>