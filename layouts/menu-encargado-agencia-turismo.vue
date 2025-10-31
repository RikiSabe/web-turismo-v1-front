<template>
  <div class="card p-2">
    <Menubar :model="items" class="justify-between">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #start>
        <div class="flex items-center">
          <span> Turismo Bolivia </span>
          <Divider layout="vertical"/>
          <Button variant="text" severity="success">
            <img :src="Usuario.foto" alt="Foto de perfil" class="w-8 h-8 rounded-full" />
            <span>{{ Usuario.nombre_completo }}</span>
          </Button>
          <Divider layout="vertical"/>
          <span> Encargado de Agencias </span>
        </div>
      </template>
    </Menubar>
  </div>
  <NuxtPage />
</template>

<script setup lang="ts">
import { server } from '~/server/server'

const items = [
  { label: 'Atracciones', route: '/menu/encargado-agencia-turismo/atracciones'},
  { label: 'Paquetes', route: '/menu/encargado-agencia-turismo/paquetes'},
  { label: 'Operaciones', route: '/menu/encargado-agencia-turismo/operaciones'},
  { label: 'Reservas', route: '/menu/encargado-agencia-turismo/reservas'},
  { label: 'Pagos', route: '/menu/encargado-agencia-turismo/pagos' },
  { label: 'Cerrar Sesion', route: '/menu/publico/inicio' },
]

const Usuario = reactive({ nombre_completo: '',  foto: ''})

const id = ref<any>(null)

onMounted( async () => {
  id.value = sessionStorage.getItem('id')
  if( id.value ) {
    await obtenerDatosUsuario()
  } else {
    console.error('No se encontró el ID del usuario en sessionStorage')
  }
})

async function obtenerDatosUsuario() {
  const res:any = await $fetch(server.HOST + '/api/v2/usuarios/menu/' + id.value, {
    method: 'GET'
  })
  Usuario.nombre_completo = res.nombre_completo
  const foto = res.foto
  console.log(foto)
  if(foto === "N/A"){
    Usuario.foto = "/images/profile.jpg"
  } else {
    Usuario.foto = foto
  }
}
</script>