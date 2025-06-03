<template>
  <div class="p-2">

    <Dialog v-model:visible="visibleNuevoRol" modal :style="{ width: '30rem' }">
      <template #header>
        <span class="font-bold whitespace-nowrap"> Agregar nuevo Rol </span>
      </template>
      <Form class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
            <InputText id="nombre" aria-describedby="nombre-help" size="small" fluid/>
          </div>
          <div>
            <label for="estado" class="text-sm text-slate-500"> Estado </label>
            <InputText id="estado" aria-describedby="estado-help" size="small" fluid/>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <label for="permisos" class="text-sm text-slate-500"> Permisos </label>
            <InputText id="permisos" aria-describedby="permisos-help" size="small" fluid/>
          </div>
        </div>
        <div class="flex gap-2">
          <Button label="Guardar" fluid />
          <Button label="Cancelar" fluid @click="visibleNuevoRol = false"/>
        </div>
      </Form>
    </Dialog>

    <Fieldset legend="Gestion de Roles">
      <DataTable :value="Roles" showGridlines size="small">
        <template #header>
          <div class="flex items-end justify-end gap-2">
            <Button label="Agregar nuevo Rol" size="small" @click="visibleNuevoRol = true" />
          </div>
        </template>
        <template #empty>
          <p class="text-center"> Sin Roles </p>
        </template>
        <Column field="codigo" header="#" />
        <Column field="nombre" header="Nombre" />
        <Column field="permisos" header="Permisos">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-2">
              <Tag v-for="permiso in slotProps.data.permisos" :key="permiso" :value="permiso" severity="secondary" />
            </div>
          </template>
        </Column>
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <div class="flex items-center justify-center">
              <Tag :value="nombreEstado(slotProps.data.estado)" :severity="colorEstado(slotProps.data.estado)" />
            </div>
          </template>
        </Column>
        <Column header="Acciones">
          <template #body>
            <div class="flex justify-center gap-2">
              <Button icon="pi pi-trash" variant="text" severity="warn" />
              <Button icon="pi pi-pencil" variant="text" />
            </div>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
  import { mookRolesAdmin } from '~/mooks/admin/mooks';
  definePageMeta({ layout: 'menu-admin' })

  const Roles = ref<any>([])
  const visibleNuevoRol = ref(false)

  const colorEstado = (estado: string) => { return estado === "true" ? "success" : "warn" }
  const nombreEstado = (estado: string) => { return estado === "true" ? "Activo" : "Inactivo" }

  
</script>