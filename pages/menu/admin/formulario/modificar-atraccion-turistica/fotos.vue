<template>
  <div class="h-96">
    <label for="uploadimagenes" class="text-sm text-slate-500"> Imágenes </label>
    <FileUpload
      choose-label="Elegir Imágenes"
      cancel-label="Eliminar todas"
      ref="fotos"
      :show-upload-button="false"
      class="p-button-outlined"
      accept="image/*"
      :multiple="true"
      @select="onSelectImages"
      @clear="onClearImages"
      @remove="onRemoveImages">
      <template #empty>
        <p>Seleccione las imágenes aquí</p>
      </template>
      <template #content="{ files, removeFileCallback }">
        <div class="flex flex-col gap-1">
          <div v-if="Imagenes.length > 0">
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(file, index) in Imagenes"
                :key="index"
                class="p-2 rounded-border flex flex-col shadow rounded-lg items-center gap-2">
                <div>
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="obtenerPreview(file)"
                    class="w-40 h-32 rounded-lg object-cover" />
                </div>
                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">
                  {{ file.name }}
                </span>
                <div>{{ formatSize(file.size) }}</div>
                <Button
                  icon="pi pi-times"
                  variant="outlined"
                  rounded
                  severity="danger"
                  @click="onRemoveTemplatingFile(file, removeFileCallback, index)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </FileUpload>
  </div>
  <span v-if="Imagenes.length" class="text-sm text-slate-500">
    Orden de las fotos (se mostrarán horizontalmente)
  </span>
  <div v-if="Imagenes.length" class="flex flex-wrap gap-2">
    <div
      v-for="(foto, index) in Imagenes"
      :key="index"
      class="relative object-contain w-56 h-36 rounded overflow-hidden">
      <img :src="obtenerPreview(foto)" class="object-cover w-full h-full" />
      <div class="absolute bottom-1 left-1 flex gap-1">
        <Button
          icon="pi pi-arrow-left"
          text
          size="small"
          @click="moverIzquierda(index)"
          :disabled="index === 0" />
        <Button
          icon="pi pi-arrow-right"
          text
          size="small"
          @click="moverDerecha(index)"
          :disabled="index === Imagenes.length - 1" />
      </div>
    </div>
  </div>
  <span v-if="Imagenes.length" class="text-sm text-slate-500">
    Las fotos no mantendrán su nombre original.
  </span>
  <div class="grid grid-cols-2 gap-2 pt-2 w-96">
    <Button type="button" label="Cancelar" severity="danger" @click="router.back()" fluid />
    <Button label="Guardar" fluid @click="handleChange" />
  </div>
</template>

<script setup lang="ts">
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';
import { server } from '~/server/server';

const $primevue = usePrimeVue();
const router = useRouter();
const route = useRoute();
const id_atraccion = route.query.id;
const Imagenes = ref<File[]>([]);

onMounted(async () => {
  await obtenerFotos();
});

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

async function obtenerFotos() {
  try {
    const res: any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas/fotos/' + id_atraccion, {
      method: 'GET',
    });

    console.log(JSON.stringify(res, null, 2));

    const archivos: File[] = [];
    for (const foto of res.fotos) {
      if (foto.foto.startsWith('data:image')) {
        const file = base64ToFile(foto.foto, `foto_${foto.id}.jpg`);
        archivos.push(file);
      }
    }

    Imagenes.value = archivos;

    nextTick(() => {
      const upload = fotosRef.value;
      if (upload) upload.files = Imagenes.value;
    });
  } catch (err) {
    console.error('Error al obtener fotos:', err);
  }
}

const obtenerPreview = (archivo: File) => URL.createObjectURL(archivo);

const fotosRef = ref<any>(null);

const onSelectImages = (event: FileUploadSelectEvent) => {
  Imagenes.value.push(...event.files);
};

const onClearImages = () => {
  Imagenes.value = [];
};

const onRemoveImages = (event: FileUploadRemoveEvent) => {
  Imagenes.value = Imagenes.value.filter(
    (f) => !(f.name === event.file.name && f.size === event.file.size)
  );
};

const onRemoveTemplatingFile = (file: File, removeFileCallback: any, index: number) => {
  Imagenes.value.splice(index, 1);
  removeFileCallback(index);
};

const formatSize = (bytes: number) => {
  const k = 1024;
  const dm = 2;
  const sizes = $primevue?.config?.locale?.fileSizeTypes ?? ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return `0 ${sizes[0]}`;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${formattedSize} ${sizes[i]}`;
};

function moverIzquierda(index: number) {
  if (index > 0) {
    const temp = Imagenes.value[index - 1];
    Imagenes.value[index - 1] = Imagenes.value[index];
    Imagenes.value[index] = temp;
  }
}

function moverDerecha(index: number) {
  if (index < Imagenes.value.length - 1) {
    const temp = Imagenes.value[index + 1];
    Imagenes.value[index + 1] = Imagenes.value[index];
    Imagenes.value[index] = temp;
  }
}

const obtenerExtension = (nombre: string): string => {
  const match = nombre.match(/\.[0-9a-z]+$/i);
  return match ? match[0] : '';
};

const renombrarImagenes = () => {
  Imagenes.value = Imagenes.value.map((file, i) => {
    const nuevoNombre = `${i + 1}${obtenerExtension(file.name)}`;
    return new File([file], nuevoNombre, { type: file.type });
  });
};

async function handleChange() {
  renombrarImagenes();
  console.log('Imágenes listas para guardar:', Imagenes.value);
}
</script>
