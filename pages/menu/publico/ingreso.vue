<template>
  <div class="p-2">
    <div class="flex items-center justify-center">
      <div class="card justify-center bg-white p-8 rounded-lg">
        <p class="text-xl font-bold text-center pb-2"> Inicia Sesion en tu cuenta </p>
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          :validateOnBlur="true"
          :validateOnValueUpdate="false"
          @submit="handleIngreso"
          class="flex flex-col gap-2 w-full sm:w-60"
        >
          <div class="flex flex-col gap-1">
            <label for="correo" class="text-sm text-slate-500"> Correo electrónico </label>
            <InputText id="correo" name="correo" v-model="initialValues.correo" aria-describedby="correo-help" />
            <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">{{ $form.correo.error.message }}</Message>
          </div>

          <div class="flex flex-col gap-1">
            <label for="contra" class="text-sm text-slate-500"> Contraseña </label>
            <Password id="contra" name="contra" v-model="initialValues.contra" toggleMask :feedback="false" inputClass="w-full" aria-describedby="contra-help" />
            <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">{{ $form.contra.error.message }}</Message>
          </div>

          <Button type="submit" label="Ingresar" variant="outlined" :disabled="!$form.valid" />
        </Form>
        <Divider align="center">
          <p> o tambien </p>
        </Divider>
        <div class="flex gap-2">
          <Button label="Facebook" icon="pi pi-facebook" variant="outlined" fluid />
          <Button label="Google" icon="pi pi-google" variant="outlined" fluid />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { server } from '~/server/server';
  definePageMeta({ layout: 'menu' })

  const initialValues = reactive({ correo: '', contra: '' });

  const resolver = ({ values }: any) => {
    const errors: any = {};

    if (!values.correo) {
      errors.correo = [{ message: 'El correo es requerido.' }];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
      errors.correo = [{ message: 'El correo no tiene un formato válido.' }];
    }

    if (!values.contra) {
      errors.contra = [{ message: 'La contraseña es requerida.' }];
    } else if (values.contra.length < 6) {
      errors.contra = [{ message: 'La contraseña debe tener al menos 6 caracteres.' }];
    }

    return { errors };
  }

  const route = useRouter()
  async function handleIngreso() {
    try{
      const res: any = await $fetch( server.HOST + '/api/v1/loginweb',{
        method: 'POST',
        body: { 
          correo: initialValues.correo,
          contra: initialValues.contra
        }
      })
      localStorage.setItem('id', res.id)
      localStorage.setItem('rol', res.rol)
      if ( res.rol === 'admin' ) {
        route.push('/menu/admin/usuarios')
      } else if ( res.rol === 'turista') {
        route.push('/menu/turista/inicio')
      } else if ( res.rol === 'encargado turismo'){
        route.push('/menu/encargado-agencia-turismo/paquetes')
      }
    } catch ( e ){
      console.error('Error al iniciar sesión:', e)
    }
  }
</script>