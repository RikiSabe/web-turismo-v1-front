<template>
  <div class="p-2"> 
    <Fieldset legend="Reportes">
      <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        <Card v-for="reporte in Reportes" :key="reporte.nombre">
          <template #content>
            <div class="flex flex-col gap-4">
              <p class="text-center font-semibold text-slate-700 dark:text-white"> 
                {{ reporte.nombre }} 
              </p>
              <img :src="reporte.img" :alt="reporte.nombre" class="rounded-lg"/>
              <Button 
                label="Imprimir"
                size="small"
                variant="outlined"
                fluid
                @click="reporte.action()"
              />
            </div>
          </template>
        </Card>
      </div>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { server } from '~/server/server'

definePageMeta({ layout : 'menu-admin' })

async function imprimirUsuario() {
  try {
    const reporte = await fetch(server.HOST + '/api/v1/reportes/usuarios', {
      method: 'GET'
    })
    const blob = await reporte.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch(err) {
    console.error(err)
  }
}

async function imprimirAtracciones() {
  try {
    const reporte = await fetch(server.HOST + '/api/v1/reportes/atracciones', {
      method: 'GET'
    })
    const blob = await reporte.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch(err) {
    console.error(err)
  }
}

async function imprimirAgencias() {
  try {
    const reporte = await fetch(server.HOST + '/api/v1/reportes/agencias', {
      method: 'GET'
    })
    const blob = await reporte.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch(err) {
    console.error(err)
  }
}

const Reportes = ref([
  {
    nombre: 'Imprimir todos los usuarios',
    action: imprimirUsuario,
    img: '/images/report-users.png'
  },
  {
    nombre: 'Imprimir las atracciones turísticas',
    action: imprimirAtracciones,
    img: '/images/report-atraccs.png'
  },
  {
    nombre: 'Imprimir las agencias',
    action: imprimirAgencias,
    img: '/images/report-agents.png'
  }
])
</script>
