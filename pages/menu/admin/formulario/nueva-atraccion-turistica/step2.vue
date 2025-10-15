<template>
  <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleSubmit">
    <section class="flex flex-col gap-2 items-center justify-center h-96">
      <!-- Horario apertura-->
      <div class="flex flex-col gap-1 w-96">
        <label for="horario_apertura" class="text-sm text-slate-500"> Horario de Apertura</label>
        <DatePicker 
          id="horario_apertura" name="horario_apertura"
          v-model="initialValues.horario_apertura"
          placeholder="Seleccione el horario de apertura"
          time-only :manual-input="false" hour-format="12"
          size="small" fluid />
        <Message v-if="$form.horario_apertura?.invalid" severity="error" size="small" variant="simple">
          {{ $form.horario_apertura.error.message }}
        </Message>
      </div>
      <!-- Horario cierre -->
      <div class="flex flex-col gap-1 w-96">
        <label for="horario_cierre" class="text-sm text-slate-500"> Horarios de Cierre </label>
        <DatePicker 
          id="horario_cierre" name="horario_cierre"
          v-model="initialValues.horario_cierre"
          placeholder="Seleccione el horario de cierre"
          time-only :manual-input="false" hour-format="12"
          size="small" fluid />
        <Message v-if="$form.horario_cierre?.invalid" severity="error" size="small" variant="simple">
          {{ $form.horario_cierre.error.message }}
        </Message>
      </div>
      <!-- Precio -->
      <div class="flex flex-col gap-1 w-96">
        <label for="precio" class="text-sm text-slate-500"> Precio </label>
        <InputText
          id="precio" name="precio" 
          type="number" :min="0"
          v-model="initialValues.precio" 
          placeholder="Ingrese el precio de la nueva atraccion turistica"
          size="small" fluid />
        <Message v-if="$form.precio?.invalid" severity="error" size="small" variant="simple">
          {{ $form.precio.error.message }}
        </Message>
      </div>
      
      <div class="flex flex-col gap-1 w-96">
        <label for="categoria" class="text-sm text-slate-500"> Categorias </label>
        <Select 
          id="categoria" name="categoria"
          v-model="selectedCategoria"
          size="small" placeholder="Seleccione una categoria"
          :options="Categorias" optionValue="id" optionLabel="nombre" />
      </div>

      <div class="flex flex-col gap-1 w-96">
        <label v-if="SubCategorias.length" for="subcategoria" class="text-sm text-slate-500"> SubCategorias </label>
        <div class="flex gap-2 items-center">
          <Select 
            v-if="SubCategorias.length"
            id="subcategoria" name="subcategoria"
            v-model="selectedSubcategoria" fluid
            size="small" placeholder="Seleccione la subcategoría"
            :options="SubCategorias" optionValue="id" optionLabel="nombre" />
          <Button 
            v-if="SubCategorias.length"
            size="small" label="Agregar"
            @click="agregarSubcategoria" />
        </div>
      </div>

      <div v-if="subcategoriasSeleccionadas.length" class="mt-4 w-96">
        <h3 class="text-sm text-slate-600 mb-2">Subcategorías seleccionadas:</h3>
          <ul class="flex flex-col gap-1">
            <div class="grid grid-cols-3 gap-1">
              <li v-for="(sub, index) in subcategoriasSeleccionadas" :key="sub.id" 
                class="flex justify-between items-center ring ring-slate-300 p-2 rounded-md" >
                <span> {{ sub.nombre }} </span>
                <Button 
                  icon="pi pi-trash" size="small" severity="danger" text 
                  @click="eliminarSubcategoria(index)" />
              </li>
            </div>
          </ul>
      </div>
    </section>
    <div class="flex pt-6 justify-between">
      <Button 
        type="button" label="Volver" severity="secondary" 
        icon="pi pi-arrow-left" @click="emit('return')" />
      <Button 
        type="submit" label="Siguiente" 
        icon="pi pi-arrow-right" iconPos="right" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { server } from '~/server/server';
import { atraccionStep2Resolver } from '~/utils/schemas/atracciones';

const props = defineProps<{ modalValue : any}>()
const emit = defineEmits(['update:modelValue', 'submited', 'return'])

const initialValues = props.modalValue

const resolver = computed( () => atraccionStep2Resolver)

async function handleSubmit( {valid, values} : any ) {
  if ( valid ) {
    initialValues.horario_apertura = formatoHora12(initialValues.horario_apertura)
    initialValues.horario_cierre = formatoHora12(initialValues.horario_cierre)
    initialValues.subcategorias = subcategoriasSeleccionadas.value.map(s => s.id)
    console.log(JSON.stringify(initialValues.subcategorias, null, 2))
    emit('update:modelValue', values)
    emit('submited')
  }
}

const Categorias = ref<any[]>([])
const SubCategorias = ref<any[]>([])
const selectedCategoria = ref<any>(null)
const selectedSubcategoria = ref<number | null>(null)
const subcategoriasSeleccionadas = ref<any[]>([])

onMounted( async () => {
  await obtenerCategorias()
})

async function obtenerCategorias() {
  try {
    Categorias.value = await $fetch(server.HOST + '/api/v1/categorias')
  } catch (err) {
    console.error(err)
  }
}

async function obtenerSubCategorias(id: number){
  try {
    SubCategorias.value = await $fetch(server.HOST + '/api/v1/subcategorias/' + id)
    // console.log(JSON.stringify(SubCategorias.value, null, 2) )
  } catch (err) {
    console.error(err)
  }
}

watch( selectedCategoria,async (newValue) => {
  if(newValue) {
    await obtenerSubCategorias(newValue)
  } else {
    SubCategorias.value = []
  }
})

function agregarSubcategoria() {
  if (!selectedSubcategoria.value) return

  const sub = SubCategorias.value.find(s => s.id === selectedSubcategoria.value)

  // Evitar duplicados
  if (sub && !subcategoriasSeleccionadas.value.some(s => s.id === sub.id)) {
    if (subcategoriasSeleccionadas.value.length < 3) {
      subcategoriasSeleccionadas.value.push(sub)
    } else {
      alert("Solo puede seleccionar un máximo de 3 subcategorías")
    }
  }
  selectedSubcategoria.value = null
}

function eliminarSubcategoria(index: number) {
  subcategoriasSeleccionadas.value.splice(index, 1)
}
</script>