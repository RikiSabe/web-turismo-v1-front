<template>
  <section class="p-4">
    <Fieldset legend="Nuevo Usuario">
      <Stepper value="1" class="basis-[50rem]">
        <StepList>
          <Step value="1"> Datos Personales </Step>
          <Step value="2"> Información Privada </Step>
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
              :modalPhoto="srcPhoto"
              @return="() => activateCallback('2')"
              @submited="() => onSubmit()"
              @update:modelPhoto="(val) => srcPhoto = val" />
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Fieldset>
  </section>
</template>

<script setup lang="ts">
import { server } from '~/server/server'
import FormStep1 from './nuevo-usuario/step1.vue'
import FormStep2 from './nuevo-usuario/step2.vue'
import FormStep3 from './nuevo-usuario/step3.vue'

const router = useRouter()
const dataFormStep1 = reactive({
  nombre: '', 
  apellido_paterno: '', 
  apellido_materno: '',
  telefono: '', 
  fecha_nacimiento: new Date(),
  id_ubicacion: 0,
})

const dataFormStep2 = reactive({
  ci: '',
  complemento: '',
  correo: '',
  contra: '',
  rol: ''
})

const srcPhoto = ref<File | null>(null)

async function onSubmit() {
  console.log(JSON.stringify(dataFormStep1, null, 2), JSON.stringify(dataFormStep2, null, 2), srcPhoto.value)
  try {
    const formData = new FormData()
    for(const[key, data] of Object.entries(dataFormStep1)) {
      if( key === "fecha_nacimiento" ){
        formData.append(key, (data as Date).toISOString().split('T')[0])
      } else {
        formData.append(key, String(data))
      }
    }
    for(const[key, data] of Object.entries(dataFormStep2)) {
      formData.append(key, String(data))
    }
    if(srcPhoto.value) {
      formData.append('foto', srcPhoto.value)
    } else {
      formData.append('foto', "N/A")
    }
    await $fetch(server.HOST + '/api/v2/usuarios', {
      method: 'POST',
      body: formData
    })
    router.back()
  } catch( err ) {
    console.error(err)
  }
}

</script>