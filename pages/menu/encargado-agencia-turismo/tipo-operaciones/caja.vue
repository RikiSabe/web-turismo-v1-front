<template>
  <DataTable :value="Operaciones" size="small" show-gridlines>
    <template #header>
      <div class="flex items-center justify-end">
        <Button label="Registrar Operación" size="small" variant="outlined"/>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col gap-4 p-4">
        <p class="text-center"> No hay operaciones </p>
        <div class="flex items-center justify-center">
          <Button icon="pi pi-refresh" rounded size="small" />
        </div>
      </div>
    </template>
    <Column header="ID" />
    <Column header="Origen" />
    <Column header="Fecha" />
    <Column header="# Personas" />
    <Column header="Monto" />
    <Column header="Razón Social" />
    <Column header="Identidad" />
    <Column header="Paquete" />
  </DataTable>
</template>

<script setup lang="ts">
const Operaciones = ref([])
const router = useRouter()
</script>