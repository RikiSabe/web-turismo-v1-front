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
          <span> Turismo Tarija </span>
          <Divider layout="vertical"/>
          <Button variant="text" severity="success">
            <img src="/public/images/profile.jpg" alt="Foto de perfil" class="w-8 h-8 rounded-full" />
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
    { label: 'Usuarios', route: 'usuarios' },
    { label: 'Atracciones Turisticas', route: 'atracciones-turisticas' },
    { label: 'Agencias', route: 'agencias' },
    { label: 'Cerrar Sesion', route: '/menu/publico/inicio' },
  ]
  const Usuario = reactive<{ nombre_completo: string; foto: string | null; rol: string }>({
    nombre_completo: '', 
    foto: null , 
    rol: ''
  })
  const id = ref(localStorage.getItem('id'))
  
  onMounted( async () => {
    if( id.value ) {
      await obtenerDatosUsuario()
    } else {
      console.error('No se encontró el ID del usuario en localStorage')
    }
  })

  async function obtenerDatosUsuario() {
    const res:any = await $fetch(server.HOST + '/api/v1/usuarios/' + id.value) 
    Usuario.nombre_completo = res.nombre + ' ' + res.apellido
    // Usuario.foto = res.foto == "N/A" ? '/public/images/profile.jpg' : res.foto
    Usuario.rol = res.rol
  }
</script>