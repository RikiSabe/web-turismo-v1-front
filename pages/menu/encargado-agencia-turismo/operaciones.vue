<template>
  <div class="p-2">
    <Fieldset legend="Operaciones">
      <Tabs value="0">
        <TabList>
          <Tab value="0"> Desde caja </Tab>
          <Tab value="1"> Desde reservas </Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Caja />
          </TabPanel>
          <TabPanel value="1">
            <Reservas />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Fieldset> 
  </div>
</template>

<script setup lang="ts">
import Caja from './tipo-operaciones/caja.vue';
import Reservas from './tipo-operaciones/reservas.vue';

definePageMeta({ layout: 'menu-encargado-agencia-turismo' })
</script>