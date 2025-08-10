<template>
  <Drawer v-model:visible="visibleNuevaAgencia" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nueva agencia</span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-4" id="form_nueva_agencia"
      :initialValues="initialValues" :resolver="resolver" 
      @submit="onFormSubmit" >
      
      <div class="grid grid-cols-2 gap-2">
        <!-- Nombre nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre" placeholder="Ingrese el nombre de la nueva agencia"
            v-model="initialValues.nombre"
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <!-- Telefono nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
          <InputText 
            id="telefono" name="telefono" placeholder="Ingrese el telefono de la nueva agencia"
            v-model="initialValues.telefono"
            size="small" fluid />
          <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
            {{ $form.telefono.error.message }}
          </Message>
        </div>

        <!-- Correo Electronico nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText 
            id="correo" name="correo" placeholder="Ingrese el correo electronico de la nueva agencia"
            v-model="initialValues.correo"
            size="small" fluid />
          <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
            {{ $form.correo.error.message }}
          </Message>
        </div>

        <!-- Encargado nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="encargado" class="text-sm text-slate-500"> Encargado de la Agencia (Solo se listaran los encargados)</label>
          <Select 
            id="encargado" name="encargado"
            placeholder="Seleccione el usuario que será encargado"
            v-model="initialValues.id_encargado" :options="Encargados"
            option-label="nombre" option-value="id" checkmark size="small">
            <template #empty>
              <span> Sin encagados </span>
            </template>
          </Select>
          <Message v-if="$form.encargado?.invalid" severity="error" size="small" variant="simple">
            {{ $form.encargado.error.message }}
          </Message>
        </div>
      </div>

      <!-- Descripcion nueva agencia -->
      <div class="flex flex-col gap-1">
        <label for="descripcion" class="text-sm text-slate-500"> Descripción </label>
        <InputText 
          id="descripcion" name="descripcion" placeholder="Ingrese la descripcion de la agencia"
          v-model="initialValues.descripcion" 
          size="small" fluid />
        <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.descripcion.error.message }}
        </Message>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Departamento nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
          <Select 
            id="departamento" name="departamento"
            placeholder="Seleccione el departamento donde se encuentra la nueva agencia"
            v-model="initialValues.id_departamento" :options="Departamentos" 
            optionLabel="nombre" optionValue="id" checkmark size="small"/>
          <Message v-if="$form.departamento?.invalid" severity="error" size="small" variant="simple">
            {{ $form.departamento.error.message }}
          </Message>
        </div>
      </div>

      <!-- Direccion escrita nueva agencia -->
      <div class="flex flex-col gap-1">
        <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
        <InputText 
          id="direccion" name="direccion" placeholder="Ingrese la direccion escrita de la nueva agencia"
          v-model="initialValues.direccion" aria-describedby="direccion-help" 
          size="small" fluid/>
        <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.direccion.error.message }}
        </Message>
      </div>

      <div>
        <FileUpload
          choose-label="Elegir Imagenes" cancel-label="Eliminar todas las fotos" 
          ref="fotos" :show-upload-button="false" class="p-button-outlined"
          accept="image/*" :multiple="true" >
          <template #empty>
            <p> Seleccione las imagenes aqui </p>
          </template>
        </FileUpload>
      </div>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button 
          label="Guardar" type="submit" form="form_nueva_agencia"
          size="small" fluid />
        <Button 
          label="Cancelar" type="button"  
          severity="danger" size="small"
          @click="visibleNuevaAgencia = false" fluid />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod'
import { server } from '~/server/server';

interface Props { open: boolean }
const props = defineProps<Props>()
const visibleNuevaAgencia = ref(props.open)
const emit = defineEmits(['hidden', 'refreshList', 'addedCorrect', 'addedFail'])
const Departamentos = ref<any[]>([])
const Encargados = ref<any[]>([])

onMounted( async () => {
  await obtenerDepartamentos()
  await obtenerEncargados()
})

async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos',{
    method: 'GET'
  })
  Departamentos.value = res
}

async function obtenerEncargados() {
  const res: any[] = await $fetch(server.HOST + '/api/v1/usuarios', {
    method: 'GET'
  })
  Encargados.value = res
    .filter( item => ( item.rol === "encargado de agencia"))
    .map( item => ({ id: item.id , nombre: item.nombre + " " + item.apellido_paterno }))
}

watch(visibleNuevaAgencia, (newValue) => {
  if (!newValue) {
    emit('hidden')
  }
})

const initialValues = reactive({
  nombre: '', direccion: '',
  telefono: '', correo: '',
  descripcion: '', id_encargado: '',
  id_departamento: '',
  estado: "true",
})

const fotos = ref<any>(null)

const getSchema = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

  telefono: z.string()
    .regex(/^\d{8}$/, { message: 'El teléfono debe tener exactamente 8 dígitos numéricos.' }),

  correo: z.string()
    .email({ message: 'Ingrese un correo electrónico válido.' }),

  encargado: z.number({
    required_error: 'Seleccione un encargado.',
  }),

  descripcion: z.string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),

  departamento: z.number({
    required_error: 'Seleccione un departamento.',
  }),

  direccion: z.string()
    .min(5, { message: 'La dirección es requerida y debe tener al menos 5 caracteres.' }),
})

const resolver = computed( () => zodResolver(getSchema()))

const onFormSubmit = async ( {valid} : any ) => {
  // const archivos = fotos.value?.files || []
  // const formData = new FormData()

  // try {
  //   for(const [key, data] of Object.entries(initialValues)){
  //     formData.append(key, data)
  //   }
  //   if( archivos.length == 0 ){
  //     formData.append('fotos[]', "N/A")
  //   } else {
  //     for(const foto of archivos) {
  //       formData.append('fotos[]', foto)
  //     }
  //   }
  //   await $fetch( '/api/v2/agencias', {
  //     method: 'POST',
  //     body: formData
  //   })
  //   emit('hidden'), emit('addedCorrect'), emit('refreshList')
  // } catch(err) {
  //   console.error(err)
  //   emit('addedFail')
  // }
}
</script>