import { server } from "~/server/server";

export async function ObtenerAtraccionesTuristicas(): Promise<any[]> {
  try{
    const response: any[] = await $fetch(server.HOST + '/api/v1/atracciones-turisticas')
    return response
  } catch(e) {
    console.error(e)
    return []
  }
}

export async function ObtenerAtraccionTuristica(id: number): Promise<any> {
  try{
    const reponse: any = await $fetch(server.HOST + '/api/v1/atracciones-turisticas/' + id)
    return reponse
  } catch(e) {
    console.error(e)
    return null
  }
}

export async function ModificarAtraccionTuristica(atraccion: any, id: number): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/atracciones-turisticas/' + id , {
      method: 'PUT',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(atraccion)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}

export async function AgregarAtraccionTuristica(atraccion: any): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/atracciones-turisticas', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(atraccion)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}