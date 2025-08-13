<template>
  <Toast />
  <div class="p-2">
    <div class="flex items-center justify-center">
      <div class="card justify-center bg-white p-8 rounded-lg">
        <p class="text-l font-bold text-center pb-2"> Inicia Sesion en tu cuenta </p>
        <Form
          v-slot="$form" :initialValues="initialValues" :resolver="resolver"
          @submit="handleIngreso"
          class="flex flex-col gap-2 w-full sm:w-60">
          <div class="flex flex-col gap-1">
            <label for="correo" class="text-sm text-slate-500"> Correo electrónico </label>
            <InputText 
              id="correo" name="correo" size="small"
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
              :feedback="false" inputClass="w-full" 
              aria-describedby="contra-help" size="small" />
            <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">
              {{ $form.contra.error.message }}
            </Message>
          </div>

          <Button type="submit" label="Ingresar" variant="outlined" size="small" />
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { server } from '~/server/server';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

definePageMeta({ layout: 'menu' })

const initialValues = reactive({ correo: '', contra: '' });
const route = useRouter(), toast = useToast()

const getSchema = () => z.object({
  correo: z.string()
    .min(1, { message: 'Ingrese correo electronico.' }),
  
  contra: z.string()
    .min(1, { message: 'Ingrese contraseña.'})
})

const resolver = computed( () => zodResolver(getSchema()))

async function handleIngreso({valid} : any) {
  if(valid){
    try{
      const res: any = await $fetch( server.HOST + '/api/v1/loginweb',{
        method: 'POST',
        body: { 
          correo: initialValues.correo,
          contra: initialValues.contra
        }
      })
      sessionStorage.setItem('id', res.id)
      sessionStorage.setItem('rol', res.rol)
      
      switch (res.rol) {
        case 'admin':
          route.push('/menu/admin/usuarios');
          break;

        case 'turista':
          route.push('/menu/turista/inicio');
          break;

        case 'encargado de agencia':
          route.push('/menu/encargado-agencia-turismo/paquetes');
          break;

        case 'encargado de turismo':
          route.push('/menu/encargado-atracciones-turisticas/atracciones-turisticas');
          break;

        default:
          toast.add({
            severity: 'error',
            summary: 'Inicio de Sesion',
            detail: 'Error al iniciar sesion.',
            life: 3000
          })
          break;
      }

    } catch ( e ) {
      console.error('Error al iniciar sesión:', e)
      toast.add({ 
        severity: 'error', 
        summary: 'Error en inicio de sesión', 
        detail: 'Credenciales incorrectas',
        life: 3000,
      })
    }
  }
}
</script>