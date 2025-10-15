<template>
  <p class="text-center text-2xl text-slate-600 font-semibold mt-8 mb-8"> Modificar Datos Generales </p>
  <Form 
    v-slot="$form" 
    :initialValues="initialValues" :resolver="resolver" :key="formKey" 
    @submit="handleChange">
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
      <div class="grid grid-cols-2 gap-2 pt-2 w-96">
        <Button 
          type="button" label="Cancelar" severity="danger"
          @click="router.back()" fluid />
        <Button 
          type="submit" label="Guardar" fluid />
      </div>
    </section>
  </Form>
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import { usuarioStep1Resolver } from '~/utils/schemas/usuario'

const router = useRouter()
const route = useRoute()
const id_atraccion = route.query.id

const resolver = computed( () =>  usuarioStep1Resolver ) // cambiar a atraccion turistica

const Encargados = ref<any[]>([])
const Departamentos = ref<any[]>([]) 
const Provincias = ref<any[]>([]) 
const id_departamento = ref<number>() 
const id_ubicacion = ref<any>() 
const formKey = ref(0)

const initialValues = reactive({
  nombre: '',
  id_encargado: 0,
  direccion: '',
  id_ubicacion: 0,
  descripcion: ''
})

onMounted( async () => {
  await obtenerEncargados()
  await obtenerDepartamentos()
  await obtenerDatosAtraccion()
})

async function obtenerDatosAtraccion(){
  try {
    const res:any = await $fetch(server.HOST + '/api/v2/atracciones-turisticas/datos-generales/' + id_atraccion, {
      method: 'GET'
    })
    Object.assign(initialValues, res)
    id_departamento.value = res.id_departamento
    await obtenerProvincias(id_departamento.value)
    console.log(JSON.stringify(initialValues, null, 2))
    formKey.value++
  } catch (err) {
    console.error(err)
  }
}

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

watch(id_departamento, async(newValue) => {
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

async function handleChange( { valid } : any) {
  if( valid ){
    // console.log(JSON.stringify(initialValues, null, 2))
    try {
      await $fetch(server.HOST + '/api/v2/atracciones-turisticas/datos-generales/' + id_atraccion, {
        method: 'PUT',
        body: initialValues
      })
      router.back()
    } catch (err) {
      console.error(err)
    }
  }
}
</script>