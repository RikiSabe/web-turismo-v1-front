<template>
  <div class="p-4">
    <Button label="Volver" variant="outlined" @click="router.back()" />
    <Fieldset legend="SubCategorias de: ">
      <div class="grid grid-cols-4 gap-2">
        <Card v-for="sub in SubCategorias" :key="sub.id" style="overflow: hidden;">
          <template #header>
            <p class="text-center font-bold mt-3"> {{ sub.nombre }} </p>
          </template>
          <template #content>
            <p class="text-center text-sm"> {{ sub.descripcion }} </p>
          </template>
          <template #footer>
            <Button 
              label="editar" fluid variant="outlined" />
          </template>
        </Card>
      </div>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { server } from '~/server/server'

definePageMeta({ layout : 'menu-admin' })
const router = useRouter()
const SubCategorias = ref<any[]>([])

onMounted( async () => {
  await obtenerSubCategorias()
})

async function obtenerSubCategorias(){
  try {
    const res:any[] = await $fetch(server.HOST + '/api/v1/subcategorias/2' , {
      method: 'GET'
    })
    SubCategorias.value = res
    console.log(JSON.stringify(SubCategorias.value, null, 2))
  } catch (err) {
    console.error( err )
  }
}
</script>