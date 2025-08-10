<template>
  <div class="p-2">
    <Fieldset legend="Gestión de Reservas">
      <DataTable :value="Reservas" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <InputText placeholder="Filtrar reserva..." size="small"/>
            <Button label="Todos" variant="outlined" size="small" severity="info" />
            <Button label="Completados" variant="outlined" size="small" severity="success" />
            <Button label="Pendientes" variant="outlined" size="small" severity="warn" />
            <Button label="Cancelados" variant="outlined" size="small" severity="danger" />
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col gap-4 p-4">
            <p class="text-center"> No hay atracciones turisticas</p>
            <div class="flex items-center justify-center">
              <Button icon="pi pi-refresh" rounded size="small" />
            </div>
          </div>
        </template>
        <Column field="id" header="#" />
        <Column header="Paquete">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <p> {{ slotProps.data.paquete.nombre }} </p>
              <Button icon="pi pi-eye" size="small" variant="text"/>
            </div>
          </template>
        </Column>
        <Column header="Reservado por">
          <template #body="slotProps">
            <p> {{ slotProps.data.usuario.nombre }} </p>
          </template>
        </Column>
        <Column field="fecha" header="Fecha de reserva" />
        <Column header="Promoción">
          <template #body="slotProps">
            <div class="flex items-center justify-between">
              <p> {{ slotProps.data.promocion.nombre }} </p>
              <Button icon="pi pi-eye" variant="text" size="small"/>
            </div>
          </template>
        </Column>
        <Column header="#">
          <template #body="slotProps">
            <p v-if="slotProps.data.numero_personas > 1"> {{ slotProps.data.numero_personas }} personas </p>
            <p v-if="slotProps.data.numero_personas == 1"> {{ slotProps.data.numero_personas }} persona </p>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="slotProps">
            <Tag severity="success" :value="slotProps.data.estado" />
          </template>
        </Column>
        <Column header="Acciones" >
          <template #body="slotProps">
            <Button label="decidir" size="small" variant="outlined"/>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'menu-admin'}) 

const Reservas = ref<any[]>([])

onMounted( async () => {
  Reservas.value = [
    {
      id: 1,
      paquete: {
        id: 1,
        nombre: "Paquete 1",
      },
      usuario: {
        id: 2,
        nombre: "Ricardo Campos",
      },
      fecha: '13-07-2025',
      promocion: {
        id: 10,
        nombre: "Promocion clasica"
      }, 
      numero_personas: 2,
      estado: 'Pendiente',
    }
  ]
})
</script>