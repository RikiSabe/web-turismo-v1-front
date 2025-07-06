<template>
  <Drawer v-model:visible="visibleNuevaAgencia" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap">Agregar nueva agencia</span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-4" id="id-form-nueva-agencia"
      :initialValues="initialValues" :resolver="resolver" 
      :validateOnValueUpdate="false" :validateOnBlur="true"
      @submit="onFormSubmit" >
      
      <div class="grid grid-cols-3 gap-2">
        <!-- Nombre nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre" placeholder="Ingrese el nombre de la nueva agencia"
            v-model="initialValues.nombre" aria-describedby="nombre-help" 
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <!-- Telefono nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
          <InputText 
            id="telefono" name="telefono" placeholder="Ingrese el telefono de la nueva agencia"
            v-model="initialValues.telefono" aria-describedby="telefono-help" 
            size="small" fluid />
          <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
            {{ $form.telefono.error.message }}
          </Message>
        </div>

        <!-- Correo Electronico nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText 
            id="correo" name="correo_electronico" placeholder="Ingrese el correo electronico de la nueva agencia"
            v-model="initialValues.correo_electronico" aria-describedby="correo-help" 
            size="small" fluid />
          <Message v-if="$form.correo_electronico?.invalid" severity="error" size="small" variant="simple">
            {{ $form.correo_electronico.error.message }}
          </Message>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Departamento nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
          <Select 
            id="departamento" placeholder="Seleccione el departamento donde se encuentra la nueva agencia"
            v-model="id_departamento" :options="Departamentos" 
            optionLabel="nombre" optionValue="id" checkmark />
        </div>

        <!-- Provinci nueva agencia -->
        <div class="flex flex-col gap-1">
          <label v-if="Provincias.length" for="provincia" class="text-sm text-slate-500" > Provincia </label>
          <Select
            placeholder="Seleccione la provincia donde se encuentra la nueva agencia"
            id="provincia" v-if="Provincias.length"
            v-model="id_provincia" :options="Provincias"
            optionLabel="nombre" optionValue="id" checkmark />
        </div>
      </div>

      <!-- Direccion escrita nueva agencia -->
      <div class="flex flex-col gap-1">
        <label for="direccion" class="text-sm text-slate-500"> Direccion </label>
        <InputText 
          id="direccion" name="direccion" placeholder="Ingrese la ubicacion escrita de la nueva agencia"
          v-model="initialValues.direccion" aria-describedby="direccion-help" 
          size="small" fluid/>
        <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">
          {{ $form.direccion.error.message }}
        </Message>
      </div>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button 
          label="Guardar" type="submit" 
          form="id-form-nueva-agencia" fluid />
        <Button 
          label="Cancelar" type="button"  
          severity="danger" 
          @click="visibleNuevaAgencia = false" fluid />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
  import { AgregarAgencia } from '~/api/agencias';
  import { server } from '~/server/server';

  interface Props { open: boolean }
  const props = defineProps<Props>()
  const visibleNuevaAgencia = ref(props.open)
  const emit = defineEmits(['hidden', 'refreshList', 'addedCorrect', 'addedFail'])
  const Departamentos = ref<any[]>([])
  const id_departamento = ref()
  const Provincias = ref<any[]>([])
  const id_provincia = ref()

  onMounted( async () => {
    await obtenerDepartamentos()
  })

  async function obtenerDepartamentos(){
    const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos')
    Departamentos.value = res
  }

  watch(id_departamento, async (newValue) => {
    id_provincia.value = null
    if( newValue != null ){
      await obtenerProvincias(newValue)
    } else{
      Provincias.value = []
    }
  })

  async function obtenerProvincias(id : any) {
    const res: any[] = await $fetch(server.HOST + '/api/v1/provincias/' + id)
    Provincias.value = res
  }

  watch(visibleNuevaAgencia, (newValue) => {
    if (!newValue) {
      emit('hidden')
    }
  })

  const initialValues = reactive({
    nombre: null as string | null,
    direccion: '',
    telefono: '',
    correo_electronico: '',
    estado: true,
  })

  const resolver = ({ values }: any) => {
    const errors: any = {};
    
    if (!values.nombre) {
      errors.nombre = [{ message: 'El nombre es requerido.' }];
    } else if (values.nombre.length < 3) {
      errors.nombre = [{ message: 'El nombre debe tener al menos 3 caracteres.' }];
    }
    
    if (!values.direccion) {
      errors.direccion = [{ message: 'La dirección es requerida.' }];
    } else if (values.direccion.length < 5) {
      errors.direccion = [{ message: 'La dirección debe tener al menos 5 caracteres.' }];
    }
    
    if (!values.telefono) {
      errors.telefono = [{ message: 'El teléfono es requerido.' }];
    } else if (!/^\d+$/.test(values.telefono)) {
      errors.telefono = [{ message: 'El teléfono solo debe contener dígitos.' }];
    } else if (values.telefono.length != 8 ) {
      errors.telefono = [{ message: 'El teléfono debe tener 8 dígitos.' }];
    }
    
    if (!values.correo_electronico) {
      errors.correo_electronico = [{ message: 'El correo electrónico es requerido.' }];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo_electronico)) {
      errors.correo_electronico = [{ message: 'El correo electrónico no es válido.' }];
    }
    
    return { errors };
  }

  const onFormSubmit = async () => {
    const response = await AgregarAgencia(initialValues)
    if (response) {
      emit('addedCorrect')
      emit('refreshList')
      visibleNuevaAgencia.value = false
    } else {
      emit('addedFail')
    }
  }
</script>