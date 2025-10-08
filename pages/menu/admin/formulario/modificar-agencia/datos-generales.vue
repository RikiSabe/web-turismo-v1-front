<template>
  <Form 
    v-slot="$form" 
    :initialValues="initialValues" :resolver="resolver" :key="formKey" 
    @submit="handleChange">
    <section class="flex flex-col items-center justify-center">
      <!-- Nombre nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
        <InputText 
          id="nombre" name="nombre"
          v-model="initialValues.nombre"
          placeholder="Ingrese el nombre de la nueva agencia"
          size="small" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
          {{ $form.nombre.error.message }}
        </Message>
      </div>
      <!-- Telefono nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
        <InputText 
          id="telefono" name="telefono" 
          v-model="initialValues.telefono"
          placeholder="Ingrese el telefono de la nueva agencia"
          size="small" fluid />
        <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
          {{ $form.telefono.error.message }}
        </Message>
      </div>
  
      <!-- Correo Electronico nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
        <InputText 
          id="correo" name="correo" 
          v-model="initialValues.correo"
          placeholder="Ingrese el correo electronico de la nueva agencia"
          size="small" fluid />
        <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
          {{ $form.correo.error.message }}
        </Message>
      </div>
  
      <!-- Encargado nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="encargado" class="text-sm text-slate-500"> Encargado de la Agencia (Solo se listaran los encargados)</label>
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
  
      <!-- Descripcion nueva agencia -->
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
  
      <!-- Departamento nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
        <Select 
          id="departamento" name="departamento"
          placeholder="Seleccione el departamento donde se encuentra la nueva agencia"
          :options="Departamentos" 
          v-model="initialValues.id_departamento"
          optionLabel="nombre" optionValue="id" checkmark size="small"/>
        <Message v-if="$form.departamento?.invalid" severity="error" size="small" variant="simple">
          {{ $form.departamento.error.message }}
        </Message>
      </div>
  
      <!-- Direccion escrita nueva agencia -->
      <div class="flex flex-col gap-1 w-96">
        <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
        <InputText 
          id="direccion" name="direccion" 
          placeholder="Ingrese la direccion escrita de la nueva agencia"
          aria-describedby="direccion-help" 
          v-model="initialValues.direccion"
          size="small" fluid/>
        <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.direccion.error.message }}
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
import { agenciaResolver } from '~/utils/schemas/agencia'


const router = useRouter()
const route = useRoute()
const id_agencia = route.query.id
const formKey = ref(0)

const Departamentos = ref<any[]>([])
const Encargados = ref<any[]>([])

const initialValues = reactive({
  nombre: '',
  telefono: '',
  correo: '',
  id_encargado: 0,
  descripcion: '',
  id_departamento: 0,
  direccion: ''
})

onMounted( async () => {
  await obtenerDepartamentos()
  await obtenerEncargados()
  await obtenerDatosAgencia()
})

async function obtenerDatosAgencia(){
  try {
    const res:any = await $fetch(server.HOST + '/api/v1/agencias/datos-generales/' + id_agencia, {
      method: 'GET'
    })
    console.log(JSON.stringify(res, null, 2))
    Object.assign(initialValues, res)
    formKey.value++
  } catch (err){
    console.error(err)
  }
}

async function obtenerDepartamentos(){
  try {
    const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos',{
      method: 'GET'
    })
    Departamentos.value = res
  } catch( e : any) {
    console.error(e)
  }
}

async function obtenerEncargados() {
  try {
    const res: any[] = await $fetch(server.HOST + '/api/v1/usuarios', {
      method: 'GET'
    })
    Encargados.value = res
      .filter( item => ( item.rol === "encargado de agencia"))
      .map( item => ({ id: item.id , nombre: item.nombre + " " + item.apellido_paterno }))
  } catch( e : any) {
    console.error(e)
  }
}

const resolver = computed( () => agenciaResolver() )

async function handleChange( {valid} : any ){
  if( valid ){
    console.log(initialValues)
  }
}
</script>