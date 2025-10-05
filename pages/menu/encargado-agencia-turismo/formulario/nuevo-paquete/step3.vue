<template>
  <!-- Seleccionar Atracciones -->
  <Form v-slot="$form" @submit="handleSubmit">
    <section class="flex flex-col gap-2 items-center justify-center h-96">
      <div class="flex flex-col gap-1 w-96">
        <label class="text-sm text-slate-500">Atracciones Turísticas</label>
        <MultiSelect
          name="id_atracciones" id="id_atracciones"
          v-model="selectedIds"
          :options="atraccionesOptions"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccione atracciones"
          display="chip"
          size="small"
        />
        <Message
          v-if="$form.id_atracciones?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.id_atracciones?.error?.message }}
        </Message>
      </div>

      <div v-if="atraccionesSeleccionadas.length" class="mt-2">
        <Fieldset legend="Configuración de Atracciones">
          <div class="grid grid-cols-3 gap-3 mb-1">
            <span>Orden</span>
            <span class="text-center">Nombre</span>
            <span class="text-end">Duración (horas)</span>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="(atr, index) in atraccionesSeleccionadas"
              :key="atr.id"
              class="grid grid-cols-3 gap-3 items-center ring-1 ring-slate-300 p-2 rounded-lg"
            >
              <!-- Botones de orden -->
              <div class="flex gap-1">
                <Button
                  v-if="index !== 0"
                  icon="pi pi-arrow-up"
                  size="small"
                  outlined
                  @click="moverArriba(index)"
                />
                <Button
                  v-if="index !== atraccionesSeleccionadas.length - 1"
                  icon="pi pi-arrow-down"
                  size="small"
                  outlined
                  @click="moverAbajo(index)"
                />
              </div>

              <!-- Nombre -->
              <span class="font-medium text-gray-600 text-center">{{ atr.nombre }}</span>

              <!-- Duración -->
              <div class="flex justify-end">
                <Select
                  v-model="atraccionesSeleccionadas[index].duracion"
                  class="w-30"
                  :options="DuracionesLimitadas"
                  placeholder="Duración"
                  size="small"
                />
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
    </section>

    <div class="flex pt-6 justify-between">
      <Button
        label="Volver"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="emit('return')"
      />
      <Button label="Guardar" type="submit" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { server } from '~/server/server'
const emit = defineEmits(['submited', 'return'])

const atraccionesOptions = ref<any[]>([])
const DuracionesLimitadas = ref([1, 2, 3, 4])

interface Atracciones {
  id: number, nombre: string, orden: number, duracion: number
}

const selectedIds = ref([])

const atraccionesSeleccionadas = ref<Atracciones[]>([])

onMounted(async () => {
  await obtenerAtraccionesTuristicas()
})

async function obtenerAtraccionesTuristicas() {
  try {
    const res: any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas')
    atraccionesOptions.value = res.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
    }))
  } catch (err) {
    console.error(err)
  }
}

watch(selectedIds, (ids) => {
  const duracionDefault = DuracionesLimitadas.value[0]

  atraccionesSeleccionadas.value = ids.map((id: any, index: any) => {
    const atr = atraccionesOptions.value.find(a => a.id === id)
    const existente = atraccionesSeleccionadas.value.find((a: any) => a.id === id)
    return {
      id: atr.id,
      nombre: atr.nombre,
      orden: index + 1,
      duracion: existente?.duracion || duracionDefault
    }
  })
})

function moverArriba(index: number) {
  if (index > 0) {
    const temp = atraccionesSeleccionadas.value[index]
    atraccionesSeleccionadas.value.splice(index, 1)
    atraccionesSeleccionadas.value.splice(index - 1, 0, temp)
    actualizarOrden()
  }
}

function moverAbajo(index: number) {
  if (index < atraccionesSeleccionadas.value.length - 1) {
    const temp = atraccionesSeleccionadas.value[index]
    atraccionesSeleccionadas.value.splice(index, 1)
    atraccionesSeleccionadas.value.splice(index + 1, 0, temp)
    actualizarOrden()
  }
}

function actualizarOrden() {
  atraccionesSeleccionadas.value.forEach((a, i) => (a.orden = i + 1))
}

function handleSubmit() {
  localStorage.setItem('atracciones', JSON.stringify(atraccionesSeleccionadas.value))
  emit('submited')
}
</script>