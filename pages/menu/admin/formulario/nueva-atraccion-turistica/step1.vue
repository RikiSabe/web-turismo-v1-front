<template>
  <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleSubmit">
    <section class="flex flex-col items-center justify-center h-96">
      <!-- Nombre -->
      <div class="flex flex-col gap-1 w-96">
        <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
        <InputText 
          id="nombre" name="nombre"
          v-model="initialValues.nombre"
          placeholder="Ingrese el nombre de la nueva atraccion turistica"
          size="small" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
          {{ $form.nombre.error.message }}
        </Message>
      </div>
      <!-- Encargado -->
      <div class="flex flex-col gap-1 w-96">
        <label for="encargado" class="text-sm text-slate-500"> Encargado de la Atraccion Turística</label>
        <Select 
          id="encargado" name="encargado"
          placeholder="Seleccione el usuario que será encargado"
          :options="Encargados"
          v-model="initialValues.id_encargado"
          optionLabel="nombre" optionValue="id" checkmark size="small">
          <template #empty>
            <span> Sin encagados </span>
          </template>
        </Select>
        <Message v-if="$form.encargado?.invalid" severity="error" size="small" variant="simple">
          {{ $form.encargado.error.message }}
        </Message>
      </div>
      <!-- Ubicacion -->
      <div class="flex flex-col gap-1 w-96">
        <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
        <InputText 
          id="direccion" name="direccion"
          v-model="initialValues.direccion"
          placeholder="Describa el lugar de donde se encuentra la atraccion turistica"
          size="small" fluid />
        <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.direccion.error.message }}
        </Message>
      </div>
      <!-- Departamento nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
        <Select 
          id="departamento" name="departamento" 
          placeholder="Seleccione el departamento donde se encuentra el nuevo usuario"
          v-model="id_departamento" :options="Departamentos"
          optionLabel="nombre" optionValue="id" checkmark size="small"/>
        <Message v-if="$form.departamento?.invalid" severity="error" size="small" variant="simple">
          {{ $form.departamento.error.message }}
        </Message>
      </div>
      <!-- Provincia nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label v-if="Provincias.length" for="provincia" class="text-sm text-slate-500" > Provincia </label>
        <Select
          placeholder="Seleccione la provincia donde se encuentra el nuevo usuario"
          id="provincia" v-if="Provincias.length" name="provincia"
          v-model="initialValues.id_ubicacion" :options="Provincias"
          optionLabel="nombre" optionValue="id" checkmark size="small" />
        <Message v-if="$form.provincia?.invalid" severity="error" size="small" variant="simple">
          {{ $form.provincia.error.message }}
        </Message>
      </div>
      <!-- Descripcion -->
      <div class="flex flex-col gap-1 w-96">
        <label for="descripcion" class="text-sm text-slate-500"> Descripción </label>
        <InputText 
          id="descripcion" name="descripcion"
          v-model="initialValues.descripcion" 
          placeholder="Ingrese la descripcion de la agencia"
          size="small" fluid />
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
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
import { atraccionStep1Resolver } from '~/utils/schemas/atracciones';

const props = defineProps<{ modalValue: any }>()
const emit = defineEmits(['update:modelValue', 'submited'])

const router = useRouter()
const initialValues = props.modalValue

const resolver = computed( () => atraccionStep1Resolver )

const Encargados = ref<any[]>([])
const Departamentos = ref<any[]>([]) 
const Provincias = ref<any[]>([]) 
const id_departamento = ref<number>() 
const id_ubicacion = ref<any>() 

onMounted( async () => {
  await obtenerEncargados()
  await obtenerDepartamentos()
})

async function obtenerEncargados(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/usuarios', {
    method: 'GET'
  })
  Encargados.value = res
    .filter( (item:any) => item.rol === "encargado de turismo")
    .map( (item:any) => ({ id : item.id, nombre: item.nombre + " " + item.apellido_paterno }))
}

async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos')
  Departamentos.value = res
}

watch(id_departamento, async (newValue) => {
  id_ubicacion.value = null
  if( newValue != null ){
    await obtenerProvincias(newValue)
  } else {
    Provincias.value = []
    initialValues.id_ubicacion = 0
  }
})

async function obtenerProvincias(id : any) {
  const res: any[] = await $fetch(server.HOST + '/api/v1/provincias/' + id)
  Provincias.value = res
}

async function handleSubmit( { valid, values } : any ) {
  if( valid ) {
    console.log(JSON.stringify(values, null, 2))
    emit("update:modelValue", values)
    emit("submited")
  }
}

</script>