<template>
  <p class="text-center text-2xl text-slate-600 font-semibold mt-8 mb-8"> Modificar Datos Personales </p>
  <Form 
    v-slot="$form" 
    :initialValues="initialValues" :resolver="resolver" :key="formKey"
    @submit="handleChange">
    <section class="flex flex-col items-center justify-center">
      <!-- Nombre nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
        <InputText 
          id="nombre" name="nombre" placeholder="Ingrese el nombre del nuevo usuario"
          v-model="initialValues.nombre" 
          size="small" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
          {{ $form.nombre.error.message }}
        </Message>
      </div>
      <!-- Apellido Paterno nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="apellido_paterno" class="text-sm text-slate-500"> Apellido Paterno </label>
        <InputText 
          id="apellido_paterno" name="apellido_paterno" placeholder="Ingrese el apellido paterno del nuevo usuario"
          v-model="initialValues.apellido_paterno" 
          size="small" fluid/>
        <Message v-if="$form.apellido_paterno?.invalid" severity="error" size="small" variant="simple">
          {{ $form.apellido_paterno.error.message }}
        </Message>
      </div>
      <!-- Apellido Materno nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="apellido_materno" class="text-sm text-slate-500"> Apellido Materno </label>
        <InputText
          id="apellido_materno" name="apellido_materno" placeholder="Ingrese el apellido materno del nuevo usuario"
          v-model="initialValues.apellido_materno"
          size="small" fluid />
          <Message v-if="$form.apellido_materno?.invalid" severity="error" size="small" variant="simple">
            {{ $form.apellido_materno.error.message }}
          </Message>
      </div>
      <!-- Telefono nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
        <InputText 
          id="telefono" name="telefono" placeholder="Ingrese el telefono del nuevo usuario"
          v-model="initialValues.telefono" inputmode="numeric"
          size="small" fluid />
        <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
          {{ $form.telefono.error.message }}
        </Message>
      </div>
      <!-- Fecha de Nacimiento nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="fecha_nacimiento" class="text-sm text-slate-500"> Fecha de Nacimiento </label>
        <DatePicker v-model="initialValues.fecha_nacimiento" dateFormat="yy/mm/dd" size="small" :maxDate="maxDate"/>
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
          v-model="id_provincia" :options="Provincias"
          optionLabel="nombre" optionValue="id" checkmark size="small" />
        <Message v-if="$form.provincia?.invalid" severity="error" size="small" variant="simple">
          {{ $form.provincia.error.message }}
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

const route = useRoute()
const id_usuario = route.query.id
const router = useRouter()
const formKey = ref(0)

const initialValues = reactive({
  nombre: '',
  apellido_materno: '',
  apellido_paterno: '',
  telefono: '',
  fecha_nacimiento: new Date(),
  id_ubicacion: 0
})

const resolver = computed( () => usuarioStep1Resolver() )

const Departamentos = ref<any[]>([])
const Provincias = ref<any[]>([])
const id_departamento = ref<number | null>()
const id_provincia = ref<number | null>()
const CorreosUsuarios = ref<{ correo : string }[]>([])
const maxDate = ref(new Date())

onMounted( async () => {
  await obtenerDepartamentos()
  await ObtenerUsuarios()
  await ObtenerDatosUsuario()
})

async function ObtenerDatosUsuario() {
  try {
    const res: any = await $fetch(server.HOST + '/api/v1/usuarios/datos-personales/' + id_usuario, {
      method: 'GET'
    })
    initialValues.nombre = res.nombre
    initialValues.apellido_paterno = res.apellido_paterno
    initialValues.apellido_materno = res.apellido_materno
    initialValues.telefono = res.telefono
    initialValues.fecha_nacimiento = res.fecha_nacimiento
    id_departamento.value = res.id_departamento
    await obtenerProvincias(res.id_departamento)
    id_provincia.value = res.id_ubicacion
    initialValues.id_ubicacion = res.id_ubicacion
    formKey.value++
  } catch (err) {
    console.error(err)
  }
}

async function ObtenerUsuarios(){
  const res : any[] = await $fetch(server.HOST + '/api/v1/usuarios',{
    method: 'GET'
  })
  CorreosUsuarios.value = res.map( item => ({ correo: item.correo }))
  console.log(CorreosUsuarios.value)
}

async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos')
  Departamentos.value = res
}

watch(id_departamento, async (newValue) => {
  id_provincia.value = null
  if( newValue != null ){
    await obtenerProvincias(newValue)
  } else {
    Provincias.value = []
    initialValues.id_ubicacion = 0
  }
})

watch(id_provincia, (newValue) => {
  if (newValue) {
    initialValues.id_ubicacion = newValue
  } else {
    initialValues.id_ubicacion = 0
  }
})

async function obtenerProvincias(id : any) {
  const res: any[] = await $fetch(server.HOST + '/api/v1/provincias/' + id)
  Provincias.value = res
}

async function handleChange( {valid, values} : any ) {
  if( valid ) {
    console.log(JSON.stringify(values, null, 2))
  }
}
</script>