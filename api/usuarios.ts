import { server } from "~/server/server";

export async function ObtenerUsuarios(): Promise<any[]> {
  try{
    const response: any[] = await $fetch(server.HOST + '/api/v1/usuarios')
    return response
  } catch(e) {
    console.error(e)
    return []
  }
}

export async function ObtenerUsuario(id: number): Promise<any> {
  try{
    const reponse: any = await $fetch(server.HOST + '/api/v1/usuarios/' + id)
    return reponse
  } catch(e) {
    console.error(e)
    return null
  }
}

export async function ModificarUsuario(usuario: any, id: number): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/usuarios/' + id , {
      method: 'PUT',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(usuario)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}

export async function AgregarUsuario(usuario:any): Promise<boolean> {
  try{
    await $fetch(server.HOST + '/api/v1/usuarios', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(usuario)
    })
    return true
  } catch(e){
    console.error(e)
    return false
  }
}