<template>
  <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleSubmit">
    <section class="flex flex-col gap-2 items-center justify-center h-96">
      <!-- Cedula de Identidad -->
      <div class="grid grid-cols-5 gap-2 w-96">
        <div class="col-span-3 gap-1">
          <label for="ci" class="text-sm text-slate-500"> Cédula de Identidad </label>
          <InputText 
            id="ci" name="ci" placeholder="Ingrese la cédula de identidad del nuevo usuario"
            type="number" v-model="initialValues.ci"
            size="small" fluid/>
          <Message v-if="$form.ci?.invalid" severity="error" size="small" variant="simple">
            {{ $form.ci.error.message }}
          </Message>
        </div>
        <div class="col-span-2 gap-1">
          <label for="complemento" class="text-sm text-slate-500"> Complemento </label>
          <InputText
            id="complemento" name="complemento" 
            placeholder="Ingrese Complemento si es necesario"
            v-model="initialValues.complemento"
            size="small" fluid />
        </div>
      </div>
      <!-- Correo -->
      <div class="flex flex-col gap-1 w-96">
        <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
        <InputText 
          id="correo" name="correo" placeholder="Ingrese el correo electronico del nuevo usuario"
          v-model="initialValues.correo" 
          size="small" fluid />
        <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
          {{ $form.correo.error.message }}
        </Message>
      </div>
      <!-- Contra nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="contra" class="text-sm text-slate-500"> Contraseña </label>
        <InputText 
          id="contra" name="contra" placeholder="Ingrese la contraseña del nuevo usuario"
          v-model="initialValues.contra" 
          size="small" fluid/>
        <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">
          {{ $form.contra.error.message }}
        </Message>
      </div>
      <!-- Rol nuevo usuario -->
      <div class="flex flex-col gap-1 w-96">
        <label for="rol" class="text-sm text-slate-500"> Rol </label>
        <Select 
          id="rol" :options="Roles" name="rol"
          placeholder="Seleccione el Rol que tendrá el nuevo usuario" 
          v-model="initialValues.rol"
          fluid size="small" />
        <Message v-if="$form.rol?.invalid" severity="error" size="small" variant="simple">
          {{ $form.rol.error.message }}
        </Message>
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
import { usuarioStep2Resolver } from '~/utils/schemas/usuario';

const props = defineProps<{ modalValue : any}>()
const emit = defineEmits(['update:modelValue', 'submited', 'return'])

const initialValues = props.modalValue

const CorreosUsuarios = ref<{ correo : string }[]>([])
const Roles = ref<string[]>([
  'admin', 
  'turista', 
  'encargado de turismo', 
  'encargado de agencia', 
  'operador',
])

onMounted( () => {
  // correos usuarios
})

async function resolver(){
  usuarioStep2Resolver(CorreosUsuarios.value, Roles.value)
}

async function handleSubmit( {valid, values} : any ) {
  if ( valid ) {
    console.log(JSON.stringify(values, null, 2))
    emit('update:modelValue', values)
    emit('submited')
  }
}

</script>