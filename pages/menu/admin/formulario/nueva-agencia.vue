<template>
  <section class="p-4">
    <Fieldset legend="Nueva Agencia">
      <Stepper value="1" class="basis-[50rem]">
        <StepList>
          <Step value="1"> Información General </Step>
          <Step value="2"> Personalización </Step>
        </StepList>
        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
            <FormStep1 
              v-model="dataFormStep1"
              @submited="() => activateCallback('2')" />
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="2">
            <FormStep2 
              :modalPhoto="Imagenes"
              @return="() => activateCallback('1')"
              @submited="() => onSubmit()"
              @update:modelPhoto="(val) => Imagenes = val" />
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Fieldset>
  </section>
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import FormStep1 from './nueva-agencia/step1.vue'
import FormStep2 from './nueva-agencia/step2.vue'

const router = useRouter()
const dataFormStep1 = reactive({
  nombre: '', 
  direccion: '',
  telefono: '', 
  correo: '',
  descripcion: '', 
  id_encargado: '',
  id_departamento: '',
  estado: "true",
})

const Imagenes = ref<File[]>([])

async function onSubmit() {
  try {
    const formData = new FormData()
    for(const[key,data] of Object.entries(dataFormStep1)){
      formData.append(key, String(data))
    }
    if (Imagenes.value.length === 0) {
      formData.append("fotos[]", "N/A")
    } else {
      for(const image of Imagenes.value){
        formData.append('fotos[]', image)
      }
    }
    await $fetch(server.HOST + '/api/v1/agencias', {
      method: 'POST',
      body: formData
    })
    router.back()
  } catch(err) {
    console.error(err)
  }
}
</script>