<template>
  <div class="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
    <Card v-for="item in Contenido" style="overflow: hidden;">
      <template #header>
        <!-- <img alt="user header" :src="item.src"/> -->
      </template>
      <template #title>
        <p class="text-center"> {{ item.title }} </p>
      </template>
      <template #content>
        <p class="text-sm"> {{ item.content }} </p>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <Button label="Ver más.."  variant="outlined" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'menu' })

  const Contenido = [
    {
      title: 'Promociones',
      content: 'Aprovecha descuentos exclusivos en paquetes turísticos por tiempo limitado. ¡Viaja más por menos!',
      src: '/images/photo_turismo.jpg'
    },
    {
      title: 'Atracciones Turísticas',
      content: 'Descubre los destinos más fascinantes: ruinas históricas, maravillas naturales y experiencias culturales inolvidables.',
      src: '/images/photo_turismo.jpg'
    },
    {
      title: 'Paquetes Turísticos',
      content: 'Explora nuestras opciones de viaje todo incluido. Tenemos el paquete ideal para cada tipo de viajero.',
      src: '/images/photo_turismo.jpg'
    },
    {
      title: 'Itinerario',
      content: 'Organiza tus días con itinerarios detallados para aprovechar al máximo cada destino y actividad.',
      src: '/images/photo_turismo.jpg'
    },
    {
      title: 'Reservas',
      content: 'Reserva tu próxima aventura de forma rápida, segura y al mejor precio garantizado.',
      src: '/images/photo_turismo.jpg'
    },
    {
      title: 'Pagos',
      content: 'Realiza tus pagos en línea de forma segura y elige entre múltiples métodos de pago disponibles.',
      src: '/images/photo_turismo.jpg'
    }
  ]

</script>