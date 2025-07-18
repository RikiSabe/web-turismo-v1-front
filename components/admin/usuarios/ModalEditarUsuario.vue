<template>
  <Drawer v-model:visible="visibleModal" position="full">
    <template #header>
      <span class="font-bold whitespace-nowrap"> Modificar Usuario </span>
    </template>
    <Form
      v-slot="$form" class="flex flex-col gap-2" id="form_modificar_usuario"
      @submit="onFormSubmit" :resolver="resolver" :key="formKey"
      :initialValues="initialValues">

      <div class="grid grid-cols-2 gap-2">
        <!-- Nombre nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-sm text-slate-500"> Nombre </label>
          <InputText 
            id="nombre" name="nombre" placeholder="Ingrese el nombre"
            v-model="initialValues.nombre" 
            size="small" fluid />
          <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
            {{ $form.nombre.error.message }}
          </Message>
        </div>

        <!-- Cedula de Identidad + Complemento nuevo usuario -->
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-3 gap-1">
            <label for="ci" class="text-sm text-slate-500"> Cédula de Identidad </label>
            <InputText 
              id="ci" name="ci" placeholder="Ingrese la cédula de identidad"
              type="number" v-model="initialValues.ci"
              size="small" fluid/>
            <Message v-if="$form.ci?.invalid" severity="error" size="small" variant="simple">
              {{ $form.ci.error.message }}
            </Message>
          </div>
          <div class="col-span-2 gap-1">
            <label for="complemento" class="text-sm text-slate-500"> Complemento </label>
            <InputText
              id="complemento" name="complemento" 
              placeholder="Ingrese Complemento si es necesario"
              v-model="initialValues.complemento"
              size="small" fluid />
          </div>
        </div>

        <!-- Apellido Paterno nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="apellido_paterno" class="text-sm text-slate-500"> Apellido Paterno </label>
          <InputText 
            id="apellido_paterno" name="apellido_paterno" placeholder="Ingrese el apellido paterno"
            v-model="initialValues.apellido_paterno" 
            size="small" fluid/>
          <Message v-if="$form.apellido_paterno?.invalid" severity="error" size="small" variant="simple">
            {{ $form.apellido_paterno.error.message }}
          </Message>
        </div>

        <!-- Apellido Materno nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="apellido_materno" class="text-sm text-slate-500"> Apellido Materno </label>
          <InputText
            id="apellido_materno" name="apellido_materno" placeholder="Ingrese el apellido materno"
            v-model="initialValues.apellido_materno"
            size="small" fluid />
            <Message v-if="$form.apellido_materno?.invalid" severity="error" size="small" variant="simple">
              {{ $form.apellido_materno.error.message }}
            </Message>
        </div>
        
        <!-- Correo electronico nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="correo" class="text-sm text-slate-500"> Correo electronico </label>
          <InputText 
            id="correo" name="correo" placeholder="Ingrese el correo electronico"
            v-model="initialValues.correo" 
            size="small" fluid />
          <Message v-if="$form.correo?.invalid" severity="error" size="small" variant="simple">
            {{ $form.correo.error.message }}
          </Message>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Telefono nuevo usuario -->
          <div class="flex flex-col gap-1">
            <label for="telefono" class="text-sm text-slate-500"> Telefono </label>
            <InputText 
              id="telefono" name="telefono" placeholder="Ingrese el telefono del nuevo usuario"
              v-model="initialValues.telefono" inputmode="numeric"
              size="small" fluid />
            <Message v-if="$form.telefono?.invalid" severity="error" size="small" variant="simple">
              {{ $form.telefono.error.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-1">
            <label for="fecha_nacimiento" class="text-sm text-slate-500"> Fecha de Nacimiento </label>
            <DatePicker v-model="initialValues.fecha_nacimiento" dateFormat="yy/mm/dd" size="small" :maxDate="maxDate"/>
          </div>
        </div>

        <!-- Contra nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="contra" class="text-sm text-slate-500"> Contraseña </label>
          <InputText 
            id="contra" name="contra" placeholder="Ingrese la contraseña"
            v-model="initialValues.contra" 
            size="small" fluid/>
          <Message v-if="$form.contra?.invalid" severity="error" size="small" variant="simple">
            {{ $form.contra.error.message }}
          </Message>
        </div>

        <!-- Rol nuevo usuario -->
        <div class="flex flex-col gap-1">
          <label for="rol" class="text-sm text-slate-500"> Rol </label>
          <Select 
            id="rol" v-model="selectRol" :options="Roles" name="rol"
            placeholder="Seleccione el Rol que tendrá" 
            fluid size="small" />
          <Message v-if="$form.rol?.invalid" severity="error" size="small" variant="simple">
            {{ $form.rol.error.message }}
          </Message>
        </div>

        <!-- Departamento nueva agencia -->
        <div class="flex flex-col gap-1">
          <label for="departamento" class="text-sm text-slate-500"> Departamento </label>
          <Select 
            id="departamento" name="departamento" 
            placeholder="Seleccione el departamento donde se encuentra"
            v-model="id_departamento" :options="Departamentos"
            optionLabel="nombre" optionValue="id" checkmark size="small"/>
        </div>

        <!-- Provincia nueva agencia -->
        <div class="flex flex-col gap-1">
          <label v-if="Provincias.length" for="provincia" class="text-sm text-slate-500" > Provincia </label>
          <Select
            placeholder="Seleccione la provincia donde se encuentra"
            id="provincia" v-if="Provincias.length" name="provincia"
            v-model="initialValues.id_ubicacion" :options="Provincias"
            optionLabel="nombre" optionValue="id" checkmark size="small" />
        </div>

        <!-- Estado -->
        <div class="flex flex-col gap-1">
          <label for="estado" class="text-sm text-slate-500"> Estado </label>
          <Select 
            v-model="selectEstado"
            optionValue="valor" optionLabel="nombre" 
            :options="Estados" placeholder="Estado del usuario"
            size="small" fluid/>
        </div>
      </div>

      <!-- Imagen nuevo usuario -->
      <p v-if="!src" class="text-center text-slate-500"> Seleccione una imagen para foto de perfil </p>
      <div class="card flex flex-col items-center gap-2 mb-2">
        <FileUpload
          v-if="!src"
          customUpload auto chooseLabel="Elegir Imagen"
          mode="basic" severity="secondary" class="p-button-outlined" accept="image/*"
          @select="onFileSelect" />
        <img
          v-if="src" :src="src" alt="Image"
          class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
        <p v-else class="text-center text-slate-500"> No hay imagen seleccionada </p>
        <Button v-if="src" label="Eliminar Imagen" severity="danger" variant="outlined" @click="src = null" />
      </div>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button 
          label="Guardar" severity="success" type="submit" form="form_modificar_usuario"
          fluid size="small"/>
        <Button 
          label="Cancelar" severity="danger" 
          @click="visibleModal = false" fluid size="small" />
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { server } from '~/server/server';

interface Props { open: boolean, id: number }
const props = defineProps<Props>()
const emit = defineEmits(['hidden', 'refreshList', 'modified'])
const visibleModal = ref(props.open)
const formKey = ref(0)

const selectRol = ref()
const Roles = ref([
  'admin', 
  'turista', 
  'encargado de turismo', 
  'encargado de agencia', 
  'operador',
])

const Departamentos = ref<any[]>([]), id_departamento = ref()
const Provincias = ref<any[]>([]), id_provincia = ref()
const src = ref<any>(null)

const maxDate = new Date()

const selectEstado = ref()
const Estados = ref([
  { nombre: 'Activo', valor: true },
  { nombre: 'Inactivo', valor: false },
])

const initialValues = reactive({
  nombre: '', apellido_paterno: '', apellido_materno: '',
  correo: '', ci: '', complemento: '', fecha_nacimiento: new Date(),
  telefono: '', id_ubicacion: id_provincia, contra: '',
  foto: "N/A", rol: selectRol, estado: selectEstado,
})

onMounted( async () => {
  await obtenerDepartamentos()
  await obtenerUsuario()
})

async function obtenerDepartamentos(){
  const res: any[] = await $fetch(server.HOST + '/api/v1/departamentos')
  Departamentos.value = res
}

watch(id_departamento, async (newValue) => {
  id_provincia.value = null
  if( newValue != null ){
    await obtenerProvincias(newValue)
  } else {
    Provincias.value = []
  }
})

async function obtenerProvincias(id : any) {
  const res: any[] = await $fetch(server.HOST + '/api/v1/provincias/' + id)
  Provincias.value = res
}

watch(visibleModal, (newVal) => { 
  if( !newVal ) emit('hidden')
})

async function obtenerUsuario() {
  try {
    const res:any = await $fetch(server.HOST + '/api/v2/usuarios/' + props.id , {
      method: 'GET'
    })
    initialValues.nombre = res.nombre
    initialValues.apellido_paterno = res.apellido_paterno
    initialValues.apellido_materno = res.apellido_materno
    initialValues.ci = res.ci
    initialValues.complemento = res.complemento || ''
    initialValues.correo = res.correo
    initialValues.telefono = res.telefono
    initialValues.contra = res.contra
    initialValues.rol = res.rol
    initialValues.fecha_nacimiento = res.fecha_nacimiento
    selectRol.value = res.rol
    selectEstado.value = res.estado
    initialValues.foto = res.foto
    src.value = res.foto
    initialValues.foto

    for(const departamento of Departamentos.value) {
      const temp:any[] = await $fetch(server.HOST + '/api/v1/provincias/' + departamento.id, {
        method: 'GET'
      } )
      const match = temp.find(value => value.id == res.id_ubicacion)
      if( match ) {
        id_departamento.value = departamento.id
        await obtenerProvincias(id_departamento.value)
        initialValues.id_ubicacion = match.id
        break
      }
    }
    formKey.value++
  } catch(err) {
    console.error(err)
  }
}

const getSchema = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),
  
  ci: z.string()
    .regex(/^\d+$/, { message: 'La Cédula de Identidad debe ser numérica.' })
    .min(7, { message: 'La Cédula de Identidad debe tener al menos 7 dígitos.' })
    .max(8, { message: 'La Cédula de Identidad no puede tener más de 8 dígitos.' }),

  apellido_paterno: z.string()
    .min(3, { message: 'El Apellido Paterno es requerido y debe tener al menos 3 caracteres.' }),
  
  correo: z.string()
    .email({ message: 'Ingrese un correo electrónico válido.' }),

  telefono: z.string()
    .regex(/^\d+$/, { message: 'El teléfono debe contener solo números.' })
    .min(8, { message: 'El teléfono debe tener al menos 8 dígitos.' })
    .max(8, { message: 'El teléfono no puede tener más de 8 dígitos.' }),

  contra: z.string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),

  rol: z.string()
    .refine(val => Roles.value.includes(val), { message: 'Seleccione un Rol válido.' }),
})

const resolver = computed( () => zodResolver(getSchema()))

const onFormSubmit = async ( {valid} : any ) => {
  if(!valid) return
  const formData = new FormData()
  try {
    for(const [key, data] of Object.entries(initialValues)) {
      if( key === "fecha_nacimiento" ){
        if( typeof data === "string" ){
          formData.append(key, data) 
        } else if( data instanceof Date ) {
          formData.append(key, data.toISOString().split('T')[0])
        }
      } else 
      if( key != "foto" ) {
        formData.append(key, data)
      } else if(key === "foto"){
        const file = base64ToFile(src.value!, "perfil" + props.id);
        if (file) {
          formData.append("foto", file);
        }
      }
    }
    await $fetch(server.HOST + '/api/v2/usuarios/' + props.id, {
      method: 'PUT',
      body: formData
    })
    emit('modified'), emit('hidden'), emit('refreshList')
  } catch(err) {
    console.error(err)
  }
}

function base64ToFile(base64: string, filename: string): File | null {
  try {
    if (!base64 || !base64.startsWith("data:image/")) return null;

    const parts = base64.split(",");
    if (parts.length !== 2) return null;

    const mimeMatch = parts[0].match(/:(.*?);/);
    if (!mimeMatch) return null;

    const mime = mimeMatch[1];
    const bstr = atob(parts[1]); // aquí puede fallar
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("base64ToFile error:", error);
    return null;
  }
}

function onFileSelect(event:any) {
  const file = event.files[0]
  const reader = new FileReader()
  
  reader.onload = async (e) => {
      src.value = e.target?.result
      initialValues.foto = src.value
  }
  reader.readAsDataURL(file)
  initialValues.foto = src.value
}
</script>