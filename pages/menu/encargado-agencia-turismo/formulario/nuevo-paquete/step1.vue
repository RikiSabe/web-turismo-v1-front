<template>
  <Form v-slot="$form" :initialValues="initialValues"  @submit="handleSubmit">
    <section class="flex flex-col items-center justify-center h-96">
      <!-- Nombre -->
       <div class="flex flex-col gap-1 w-96">
        <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
        <InputText 
          id="nombre" name="nombre" placeholder="Ingrese el nombre del paquete"
          v-model="initialValues.nombre" 
          size="small" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
          {{ $form.nombre.error.message }}
        </Message>
      </div>
      <!-- Encargado -->
      <div class="flex flex-col gap-1 w-96">
        <label for="agencia" class="text-sm text-slate-500"> Agencia </label>
        <Select 
          id="agencia" name="agencia"
          placeholder="Seleccione la agencia encargada"
          :options="Agencias"
          v-model="initialValues.id_agencia"
          optionLabel="nombre" optionValue="id" checkmark size="small">
          <template #empty>
            <span> Sin encagados </span>
          </template>
        </Select>
        <Message v-if="$form.agencia?.invalid" severity="error" size="small" variant="simple">
          {{ $form.agencia.error.message }}
        </Message>
      </div>
      <!-- Descripcion -->
      <div class="flex flex-col gap-1 w-96">
        <label for="descripcion" class="text-sm text-slate-500"> Descripción </label>
        <InputText 
          id="descripcion" name="descripcion"
          v-model="initialValues.descripcion" 
          placeholder="Ingrese la descripcion del paquete"
          size="small" fluid />
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
        </Message>
      </div>
      <!-- Actividades -->
      <div class="flex flex-col gap-1 w-96">
        <label for="actividades" class="text-sm text-slate-500"> Actividades </label>
        <InputText 
          id="actividades" name="actividades"
          v-model="initialValues.actividades" 
          placeholder="Ingrese las actividades del paquete"
          size="small" fluid />
        <Message v-if="$form.actividades?.invalid" severity="error" size="small" variant="simple">
          {{ $form.actividades.error.message }}
        </Message>
      </div>
      <!-- Visible -->
      <div class="flex flex-col gap-1 w-96">
        <label for="visible" class="text-sm text-slate-500"> Visibilidad </label>
        <Select 
          id="visible" name="visible"
          placeholder="Seleccione la visibilidad inicial del paquete"
          :options="OpcionesVisible"
          v-model="initialValues.visible" 
          checkmark size="small" />
        <Message v-if="$form.visible?.invalid" severity="error" size="small" variant="simple">
          {{ $form.visible.error.message }}
        </Message>
      </div>
      <!-- Precio -->
      <div class="flex flex-col gap-1 w-96">
        <label for="precio" class="text-sm text-slate-500"> Precio </label>
        <InputText
          id="precio" name="precio" 
          type="number" :min="0"
          v-model="initialValues.precio" 
          placeholder="Ingrese el precio del paquete"
          size="small" fluid />
        <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">
          {{ $form.precio.error.message }}
        </Message>
      </div>
    </section>
    <div class="flex pt-6 items-end justify-between">
      <Button 
        type="button" label="Cancelar" severity="danger"
        @click="router.back()" />
      <Button 
        type="submit" label="Siguiente" 
        icon="pi pi-arrow-right" iconPos="right" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { server } from '~/server/server';

const props = defineProps<{ modalValue: any }>()
const emit = defineEmits(['update:modelValue', 'submited'])

const initialValues = props.modalValue
const router = useRouter()

const Agencias = ref<any[]>([])
const OpcionesVisible = ref<string[]>(["Visible", "Oculto"])

onMounted( async () => {
  await obtenerAgencias()
})

async function obtenerAgencias(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/agencias', {
    method: 'GET'
  })
  Agencias.value = res
}

async function handleSubmit( { valid, values } : any ) {
  if( valid ) {
    console.log(JSON.stringify(values, null, 2))
    emit("update:modelValue", values)
    emit("submited")
  }
}

</script>