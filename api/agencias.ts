import { server } from "~/server/server";

export async function ObtenerAgencias(): Promise<any[]> {
  try{
    const response: any[] = await $fetch(server.HOST + '/api/v1/agencias')
    return response
  } catch(e) {
    console.error(e)
    return []
  }
}

export async function ObtenerAgencia(id: number): Promise<any> {
  try{
    const reponse: any = await $fetch(server.HOST + '/api/v1/agencias/' + id)
    return reponse
  } catch(e) {
    console.error(e)
    return null
  }
}

export async function ModificarAgencia(agencia: any, id: number): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/agencias/' + id , {
      method: 'PUT',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(agencia)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}

export async function AgregarAgencia(agencia:any): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/agencias', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(agencia)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}