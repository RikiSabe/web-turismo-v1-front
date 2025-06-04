<template>
  <Toast />
  <Fieldset legend="Atracciones Turisticas">
    <div class="grid grid-cols-4 gap-2">
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
          <Divider />
        </template>
        <template #footer>
          <Button type="button" label="Reservar" fluid @click="registroNecesario"/>
        </template>
      </Card>
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
  import { ObtenerAtraccionesTuristicas } from '~/api/atracciones-turisticas'
  
  const AtraccionesTuristicas = ref<any>([])
  const toast = useToast()
  onMounted( async () => {
    funcAtraccionesTuristicas()
  })

  async function funcAtraccionesTuristicas() {
    const response = await ObtenerAtraccionesTuristicas()
    AtraccionesTuristicas.value = response
  }

  const registroNecesario= () => {
    toast.add({
      summary: 'Registro Necesario', 
      detail: 'Debe estar Registrado para poder reservar esta atraccion turistica',
      severity: 'warn',
      life: 3000,
    })
  }

</script>