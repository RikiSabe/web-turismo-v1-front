<template>
  <div class="p-2">
    <div class="flex items-center justify-center">
      <div class="card justify-center bg-white p-8 rounded-lg">
        <p class="text-xl font-bold text-center pb-2"> Inicia Sesion en tu cuenta </p>
        <Form class="flex flex-col gap-2 w-full sm:w-60">
          <div class="flex flex-col">
            <label for="email" class="text-sm text-slate-500"> Correo electronico </label>
            <InputText id="email" aria-describedby="email-help" />
          </div>
          <div class="flex flex-col">
            <label for="password" class="text-sm text-slate-500"> Contraseña </label>
            <Password id="password" toggleMask :feedback="false" inputClass="w-full" aria-describedby="password-help" />
          </div>
          <Button type="submit" label="Ingresar" variant="outlined" @click="handleAdmin"/>
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
  definePageMeta({ layout: 'menu' })

  const route = useRouter()
  async function handleAdmin() {
    route.push('/menu/admin/usuarios')
  }
</script>