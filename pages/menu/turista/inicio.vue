<template>
  <div class="p-2 grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
    <Card v-for="item in Contenido" :key="item.title" style="overflow: hidden;">
      <template #header>
        <img alt="user header" :src="item.src"/>
      </template>
      <template #title>
        <p class="text-center"> {{ item.title }} </p>
      </template>
      <template #content>
        <p class="text-sm"> {{ item.content }} </p>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <Button label="Ver más.."  variant="outlined" fluid @click="item.onClick && item.onClick()"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'menu-turista' })
  const router = useRouter()

  const Contenido = [
    {
      title: 'Atracciones Turísticas',
      content: 'Descubre los destinos más fascinantes: ruinas históricas, maravillas naturales y experiencias culturales inolvidables.',
      src: '/images/photo_turismo.jpg',
      onClick: () => router.push('/menu/turista/atracciones-turisticas'),
    },
    {
      title: 'Paquetes Turísticos',
      content: 'Explora nuestras opciones de viaje todo incluido. Tenemos el paquete ideal para cada tipo de viajero.',
      src: '/images/photo_turismo.jpg',
      onClick: () => router.push('/menu/turista/paquetes-turisticos'),
    },
    {
      title: 'Itinerario',
      content: 'Organiza tus días con itinerarios detallados para aprovechar al máximo cada destino y actividad.',
      src: '/images/photo_turismo.jpg',
      onClick: () => router.push('/menu/turista/itinerario'),
    },
    {
      title: 'Reservas',
      content: 'Reserva tu próxima aventura de forma rápida, segura y al mejor precio garantizado.',
      src: '/images/photo_turismo.jpg',
      onClick: () => router.push('/menu/turista/reservas'),
    },
    {
      title: 'Pagos',
      content: 'Realiza tus pagos en línea de forma segura y elige entre múltiples métodos de pago disponibles.',
      src: '/images/photo_turismo.jpg',
      onClick: () => router.push('/menu/turista/pagos'),
    }
  ]
</script>