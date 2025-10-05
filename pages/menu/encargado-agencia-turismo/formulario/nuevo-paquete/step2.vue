<template>
  <!-- Tipo - Datos del Tipo - Hora Inicial - Cupo Total - Cupo Minimo -->
  <Form v-slot="$form" :initialValues="initialValues" @submit="handleSubmit">
    <section class="flex flex-col gap-2 items-center justify-center h-96">
      <!-- Hora Inicial -->
      <div class="flex flex-col gap-1 w-96">
        <label for="hora_inicial" class="text-sm text-slate-500"> Hora del inicio del paquete</label>
        <DatePicker 
          id="hora_inicial" name="hora_inicial"
          v-model="initialValues.hora_inicial"
          placeholder="Seleccione la hora inicial del paquete"
          time-only :manual-input="false" hour-format="12"
          size="small" fluid />
        <Message v-if="$form.hora_inicial?.invalid" severity="error" size="small" variant="simple">
          {{ $form.hora_inicial.error.message }}
        </Message>
      </div>
      <!-- Cupo Total -->
      <div class="flex flex-col gap-1 w-96">
        <label for="cupo_total" class="text-sm text-slate-500"> Cupo Total </label>
        <InputText
          id="cupo_total" name="cupo_total" 
          type="number" :min="0"
          v-model="initialValues.cupo_total" 
          placeholder="Ingrese el cupo total del paquete"
          size="small" fluid />
        <Message v-if="$form.cupo_total?.invalid" severity="error" size="small" variant="simple">
          {{ $form.cupo_total.error.message }}
        </Message>
      </div>
      <!-- Cupo Minimo -->
      <div class="flex flex-col gap-1 w-96">
        <label for="cupo_minimo" class="text-sm text-slate-500"> Cupo Minimo </label>
        <InputText
          id="cupo_minimo" name="cupo_minimo" 
          type="number" :min="0"
          v-model="initialValues.cupo_minimo" 
          placeholder="Ingrese el Cupo minimo del paquete"
          size="small" fluid />
        <Message v-if="$form.cupo_minimo?.invalid" severity="error" size="small" variant="simple">
          {{ $form.cupo_minimo.error.message }}
        </Message>
      </div>
      <!-- Tipo -->
      <div class="flex flex-col gap-1 w-96">
        <label for="tipo" class="text-sm text-slate-500"> Tipo de Paquete </label>
        <Select 
          id="tipo" name="tipo"
          placeholder="Seleccione el tipo del paquete"
          :options="OpcionesTipo"
          v-model="initialValues.tipo" 
          checkmark size="small" />
        <Message v-if="$form.tipo?.invalid" severity="error" size="small" variant="simple">
          {{ $form.tipo.error.message }}
        </Message>
      </div>
      <!-- Concurrente -->
      <div v-if="initialValues.tipo === 'Días concurrentes'" class="flex flex-col gap-1 w-96">
        <label for="concurrente" class="text-sm text-slate-500"> Concurrencia </label>
        <MultiSelect
          id="concurrente" name="concurrente"
          placeholder="Seleccione los días"
          :options="OpcionesDias"
          optionLabel="nombre" optionValue="id"
          v-model="initialValues.diasconcurrentes"
          display="chip"
          size="small" />
      </div>
      <!-- Rangos de fechas -->
      <div v-if="initialValues.tipo === 'Rango de días especificos'" class="flex flex-col gap-1 w-96">
        <label for="fecharango" class="text-sm text-slate-500"> Rango de fechas del paquete </label>
        <DatePicker
          id="fecharango" name="fecharango" placeholder="Seleccione el rango de fechas del paquete"
          v-model="initialValues.fecharango" showIcon selectionMode="range"
          dateFormat="yy-mm-dd" size="small" fluid lang="es" 
          :manual-input="false" :minDate="new Date()"/>
      </div>
      <!-- Unico Dia -->
      <div v-if="initialValues.tipo === 'Único día'" class="flex flex-col gap-1 w-96">
        <label for="fechaunica" class="text-sm text-slate-500"> Rango de fechas del paquete </label>
        <DatePicker
          id="fechaunica" name="fechaunica" placeholder="Seleccione la fecha unica del paquete"
          v-model="initialValues.fechaunica" showIcon
          dateFormat="yy-mm-dd" size="small" fluid lang="es" 
          :manual-input="false" :minDate="new Date()"/>
      </div>
    </section>
    <div class="flex pt-6 justify-between">
      <Button 
        type="button" label="Volver" severity="secondary" 
        icon="pi pi-arrow-left" @click="emit('return')" />
      <Button 
        type="submit" label="Siguiente" 
        icon="pi pi-arrow-right" iconPos="right" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { server } from '~/server/server';

const props = defineProps<{ modalValue : any}>()
const emit = defineEmits(['update:modelValue', 'submited', 'return'])

const initialValues = props.modalValue

const OpcionesTipo = ref<string[]>(["Días concurrentes", "Rango de días especificos", "Único día"])
const OpcionesDias = ref<any[]>([])

onMounted(async () => {
  await obtenerDias()
})

async function obtenerDias(){
  try {
    OpcionesDias.value = await $fetch(server.HOST + '/api/v1/dias')
  } catch(err){
    console.error(err)
  }
}

async function handleSubmit( {valid, values} : any ) {
  if ( valid ) {
    console.log(JSON.stringify(initialValues.subcategorias, null, 2))
    emit('update:modelValue', values)
    emit('submited')
  }
}

</script>