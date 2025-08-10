<template>
  <Toast />
  <Fieldset legend="Atracciones Turisticas">
    <div class="grid grid-cols-3 gap-2">
      <Card v-for="at in AtraccionesTuristicas" :key="at.id" style="overflow: hidden;">
        <template #header>
          <img alt="user header" src="/images/photo_turismo.jpg"/>
        </template>
        <template #title>
          <p class="text-center"> {{ at.nombre }} </p>
        </template>
        <template #content>
          <ScrollPanel style="width: 100%; height: 160px">
            <div class="grid grid-cols-2 gap-2">
              <!-- Tipo -->
              <div>
                <p class="text-center text-sm"><strong>Tipo</strong></p>
                <p class="text-center text-sm"> {{ at.tipo }} </p>
              </div>
              <!-- Precio -->
              <div>
                <p class="text-center text-sm"><strong> Precio </strong></p>
                <p class="text-center text-sm"> {{ at.precio }} bs </p>
              </div>
            </div>
            <!-- Direccion -->
            <div>
              <p class="text-sm"><strong> Direccion </strong></p>
              <p class="text-sm"> {{ at.ubicacion }} </p>
            </div>
            <!-- Horarios -->
            <div>
              <p class="text-sm"><strong> Horarios </strong></p>
              <p class="text-sm"> {{ at.horarios }} </p>
            </div>
            <!-- Descripcion -->
            <div>
              <p class="text-sm"><strong> Descripcion </strong></p>
              <p class="text-sm"> {{ at.descripcion }} </p>
            </div>
          </ScrollPanel>
        </template>
      </Card>
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
import { ObtenerAtraccionesTuristicas } from '~/api/atracciones-turisticas'

definePageMeta({ layout : 'menu-turista' })
const AtraccionesTuristicas = ref<any>([
  {
    "id": 1,
    "nombre": "Mirador de los Sueños",
    "tipo": "Paisaje Natural",
    "precio": 30,
    "ubicacion": "Barrio San Jorge, Tarija",
    "horarios": "08:00 - 18:00",
    "descripcion": "Un mirador panorámico que ofrece vistas espectaculares de la ciudad de Tarija y sus alrededores. Ideal para fotos al atardecer."
  },
  {
    "id": 2,
    "nombre": "Casa Dorada",
    "tipo": "Patrimonio Histórico",
    "precio": 20,
    "ubicacion": "Calle General Trigo, esquina Suipacha, Tarija",
    "horarios": "09:00 - 17:00",
    "descripcion": "Antigua casona colonial con arquitectura única. Actualmente funciona como museo y centro cultural. Muy visitado por turistas e historiadores."
  }
])

onMounted( async () => {
  // funcAtraccionesTuristicas()
})

async function funcAtraccionesTuristicas() {
  const response = await ObtenerAtraccionesTuristicas()
  AtraccionesTuristicas.value = response
}

</script>