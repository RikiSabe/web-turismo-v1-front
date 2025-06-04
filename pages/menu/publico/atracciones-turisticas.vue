<template>
  <Toast />
  <Fieldset legend="Atracciones Turisticas">
    <div class="grid grid-cols-4 gap-2">
      <Card v-for="at in AtraccionesTuristicas" :key="at.id" style="overflow: hidden;">
        <template #header>
          <img alt="user header" src="/images/photo_turismo.jpg"/>
        </template>
        <template #content>
          <ScrollPanel style="width: 100%; height: 200px">
            <div class="grid grid-cols-2 gap-2">
              <!-- Tipo -->
              <div>
                <p class="text-center"><strong>Tipo</strong></p>
                <p class="text-center"> {{ at.tipo }} </p>
              </div>
              <!-- Precio -->
              <div>
                <p class="text-center"><strong> Precio </strong></p>
                <p class="text-center"> {{ at.precio }} bs </p>
              </div>
            </div>
            <!-- Direccion -->
            <div>
              <p><strong> Direccion </strong></p>
              <p> {{ at.ubicacion }} </p>
            </div>
            <!-- Horarios -->
            <div>
              <p><strong> Horarios </strong></p>
              <p> {{ at.horarios }} </p>
            </div>
            <!-- Descripcion -->
            <div>
              <p><strong> Descripcion </strong></p>
              <p> {{ at.descripcion }} </p>
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