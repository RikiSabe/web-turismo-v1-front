<template>
  <Toast />
  <div class="p-2">
    <div class="flex items-center justify-center">
      <div class="card justify-center bg-white dark:bg-neutral-800 mt-8 p-8 rounded-lg">
        <div class="grid grid-cols-2 gap-4 p-4 rounded-lg ring ring-slate-200">
          <div>
            <img alt="login-image" src="/public/images/Registrate.jpg" class="w-96 h-[26.5rem] rounded-lg"/>
          </div>
          <div>
            <p class="text-l font-bold text-center pb-2"> Registrate </p>
            <Form
              v-slot="$form" class="flex flex-col gap-2"
              :initialValues="initialValues"
              @submit="handleIngreso">
              <div class="flex flex-col gap-1">
                <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
                <InputText
                  id="nombre" name="nombre" size="small"
                  placeholder="Ingresa tu nombre"
                  v-model="initialValues.nombre" />
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.nombre.error.message }}
                </Message>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="flex flex-col gap-1">
                  <label for="apellido_paterno" class="text-sm text-slate-500"> Apellido Paterno </label>
                  <InputText
                    id="apellido_paterno" name="apellido_paterno" size="small"
                    placeholder="Ingresa tu apellido paterno"
                    v-model="initialValues.apellido_paterno" />
                  <Message v-if="$form.apellido_paterno?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.apellido_paterno.error.message }}
                  </Message>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="apellido_materno" class="text-sm text-slate-500"> Apellido Materno </label>
                  <InputText
                    id="apellido_materno" name="apellido_materno" size="small"
                    placeholder="Ingresa tu apellido materno"
                    v-model="initialValues.apellido_materno" />
                  <Message v-if="$form.apellido_materno?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.apellido_materno.error.message }}
                  </Message>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label for="correo" class="text-sm text-slate-500"> Correo </label>
                <InputText
                  id="correo" name="correo" size="small"
                  placeholder="Ingresa tu correo electrónico"
                  v-model="initialValues.correo" />
                <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.correo.error.message }}
                </Message>
              </div>
              <div class="flex flex-col gap-1">
                <label for="contra" class="text-sm text-slate-500"> Contraseña </label>
                <Password
                  id="contra" name="contra"
                  v-model="initialValues.contra" toggleMask 
                  placeholder="Ingresa una contraseña segura"
                  :feedback="false" fluid
                  aria-describedby="contra-help" size="small" />
                <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.contra.error.message }}
                </Message>
              </div>
              <Button type="submit" label="Registrar" variant="outlined" size="small" fluid />
            </Form>
            <Divider align="center">
              <p> o también </p>
            </Divider>
            <div class="flex gap-2">
              <Button 
                label="Facebook" icon="pi pi-facebook" variant="outlined" 
                severity="info"
                fluid size="small"/>
              <Button 
                label="Google" icon="pi pi-google" variant="outlined" 
                severity="secondary"
                fluid size="small"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { server } from '~/server/server'

definePageMeta({ layout: 'menu' })

const initialValues = reactive({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  correo: '',
  contra: ''
})

async function handleIngreso({valid} : any) {
  if( valid ) {
    try {
      const response:any = await $fetch(server.HOST + '/api/v1/registro', {
        method: 'POST',
        body: initialValues
      })
      if (response.ok) {
        await useRouter().push('/menu/publico/ingreso')
      } else {
        console.error('Registration failed:', response.message)
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
  }
}
</script>