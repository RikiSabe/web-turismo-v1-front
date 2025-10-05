<template>
  <section class="p-4">
    <Fieldset legend="Nuevo Paquete">
      <Stepper value="1" class="basis-[50rem]">
        <StepList>
          <Step value="1"> General </Step>
          <Step value="2"> Programación </Step>
          <Step value="3"> Atracciones </Step>
        </StepList>
        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
            <FormStep1 
              :modalValue="dataFormStep1"
              @submited="() => activateCallback('2')" />
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="2">
            <FormStep2 
              :modalValue="dataFormStep2"
              @return="() => activateCallback('1')"
              @submited="() => activateCallback('3')" />
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="3">
            <FormStep3 
              @return="() => activateCallback('2')"
              @submited="() => onSubmit()"/>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Fieldset>
  </section>
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import FormStep1 from './nuevo-paquete/step1.vue'
import FormStep2 from './nuevo-paquete/step2.vue'
import FormStep3 from './nuevo-paquete/step3.vue'

const router = useRouter()
const dataFormStep1 = reactive({
  nombre: '',
  id_agencia : 0,
  descripcion: '',
  actividades: '',
  visible: true,
  precio: 0
})

const dataFormStep2 = reactive({
  tipo: '',
  diasconcurrentes: [] as number[],
  fecharango: [new Date(), new Date()],
  fechaunica: new Date(),
  hora_inicial: '',
  cupo_total: 0,
  cupo_minimo: 0
})

async function onSubmit(){
  try {
    const data = localStorage.getItem('atracciones')
    const bodyfetch = {
      ...dataFormStep1,
      ...dataFormStep2,
      atracciones: data
    }
    console.log(JSON.stringify(bodyfetch, null, 2))
    await $fetch(server.HOST + '/api/v1/paquetes-turisticos', {
      method: 'POST',
      body: bodyfetch
    })
    router.back()
  } catch (err) {
    console.error(err)
  }
}
</script>