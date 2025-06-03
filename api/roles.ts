import { server } from "~/server/server"

export async function ObtenerRoles(): Promise<any[]> {
  try{
    const response: any[] = await $fetch(server.HOST + '/api/v1/roles')
    return response
  } catch ( e ) {
    console.error(e)
    return []
  }
}