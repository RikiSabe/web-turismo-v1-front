<template>
  <section class="p-4">
    <Fieldset legend="Nueva Atracción Turística">
      <Stepper value="1" class="basis-[50rem]">
        <StepList>
          <Step value="1"> Datos Generales </Step>
          <Step value="2"> Datos Específicos </Step>
          <Step value="3"> Personalización </Step>
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
              :modalPhotos="Imagenes"
              @update:modelPhoto="(val) => Imagenes = val"
              @return="() => activateCallback('2')"
              @submited="() => onSubmit()" />
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Fieldset>
  </section>  
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import FormStep1 from './nueva-atraccion-turistica/step1.vue'
import FormStep2 from './nueva-atraccion-turistica/step2.vue'
import FormStep3 from './nueva-atraccion-turistica/step3.vue'

const router = useRouter()
const dataFormStep1 = reactive({
  nombre: '',
  id_encargado: 0,
  id_ubicacion: 0,
  direccion: '',
  descripcion: ''
})
const dataFormStep2 = reactive({
  horario_apertura: new Date(new Date().setHours(7,0,0,0)),
  horario_cierre: new Date(new Date().setHours(20,0,0,0)),
  precio: 0,
  subcategorias: [] as number[]
})
const Imagenes = ref<File[]>([])

async function onSubmit() {
  // console.log(JSON.stringify(dataFormStep1, null, 2), JSON.stringify(dataFormStep2, null, 2), Imagenes)
  try {
    console.log("subcategorias: ", String(dataFormStep2.subcategorias))
    const formData = new FormData()
    for(const[key, data] of Object.entries(dataFormStep1) ){
      formData.append(key, String(data))
    }
    for(const[key, data] of Object.entries(dataFormStep2) ){
      formData.append(key, String(data))
    }
    if( Imagenes.value.length === 0 ){
      formData.append('fotos[]', 'N/A')
    } else {
      for(const foto of Imagenes.value){
        formData.append('fotos[]', foto)
      }
    }
    await $fetch(server.HOST + '/api/v2/atracciones-turisticas', {
      method: 'POST',
      body: formData
    })
    router.back()
  } catch (err) {
    console.error( err )
  }
}

</script>