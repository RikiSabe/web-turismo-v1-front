<template>
  <div class="card p-2">
    <Menubar :model="items" class="justify-between">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <i :class="item.icon"></i>
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
        </div>
      </template>
    </Menubar>
  </div>
  <NuxtPage />
</template>

<script setup lang="ts">
import { server } from '~/server/server'
const items = [
  { label: 'Usuarios', route: 'usuarios', icon: 'pi pi-users' },
  { label: 'Atracciones Turísticas', route: 'atracciones-turisticas', icon: 'pi pi-star' },
  { label: 'Agencias', route: 'agencias', icon: 'pi pi-building' },
  { label: 'Reservas', route: 'reservas', icon: 'pi pi-calendar' },
  { label: 'Cerrar Sesión', route: '/menu/publico/inicio' },
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
  Usuario.foto = (res.foto == "N/A" ? "public/images/profile.jpg" : res.foto)
}
</script>