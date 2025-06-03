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
        <p> Turismo Tarija </p>
      </template>
    </Menubar>
  </div>
  <NuxtPage />
</template>

<script setup lang="ts">
  const items = [
    { label: 'Inicio', route: 'inicio' },
    { label: 'Ingresar', route: 'ingreso' },
    { label: 'Registrarme', route: 'registro' }
  ]
</script>