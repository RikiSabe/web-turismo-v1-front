<template>
  <div class="p-2">
    <div class="flex justify-between">
      <InputText type="text-search" placeholder="Buscar paquete turistico" fluid/>
      <Button label="Buscar" icon="pi pi-search" class="ml-2" />
    </div>

    <div class="grid grid-cols-5 gap-2 p-2">
      <Card v-for="paquete in paquetesTuristicos" :key="paquete.nombre" style="overflow: hidden;">
        <template #header>
          <img alt="user header" src="/images/photo_turismo.jpg"/>
        </template>
        <template #title>
          <p class="text-center font-bold"> {{ paquete.Nombre }} </p>
        </template>
        <template #content>
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker" />
            <p> {{ paquete.Lugar }} </p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-clock" />
            <p> {{ paquete.Duracion }} </p>
          </div>
          <Tag severity="success" :value="paquete.Categorias" />
          <div class="flex justify-between gap-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-dollar text-green-500" />
              <p class="text-base text-green-500"> {{ paquete.Precio }} </p>
            </div>
            <div>
              <p class="text-sm"> para {{ paquete.CantidadPersonas }} personas </p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <Button label="Ver detalles" icon="pi pi-eye" variant="outlined" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { mookPaquetesTuristicos } from '~/mooks/paquetes-turisticos/mooks'
  definePageMeta({ layout: 'menu' })

  const paquetesTuristicos = ref<any[]>([])

  onMounted( async () => {
    paquetesTuristicos.value = mookPaquetesTuristicos
  })
</script>