interface Rol {
  codigo: number, estado: string, nombre: string, permisos: string[]
}

export const mookRolesAdmin: Rol[] = [
  {
    codigo: 1,
    nombre: 'admin',
    estado: 'true',
    permisos: [
      'usuarios.ver',
      'usuarios.crear',
      'usuarios.editar',
      'usuarios.eliminar'
    ]
  },
  {
    codigo: 2,
    nombre: 'encargado de turismo',
    estado: 'true',
    permisos: [
      'paquetes.ver',
      'paquetes.crear',
      'paquetes.editar',
      'itinerarios.ver',
    ]
  },
  {
    codigo: 3,
    nombre: 'encargado de atracciones turísticas',
    estado: 'false',
    permisos: [
      'atracciones.ver',
      'atracciones.crear',
      'atracciones.editar',
      'atracciones.eliminar'
    ]
  },
  {
    codigo: 4,
    nombre: 'turista',
    estado: 'true',
    permisos: [
      'paquetes.ver',
      'atracciones.ver',
      'itinerarios.ver',
    ]
  }
]

interface Usuario{
  codigo: number
  nombre: string
  apellido: string
  correo: string
  rol: string
}

export const mookUsuarios: Usuario[] = [
  {
    codigo: 1,
    nombre: 'Carlos',
    apellido: 'Gutiérrez',
    correo: 'carlos.admin@turismo.com',
    rol: 'admin'
  },
  {
    codigo: 2,
    nombre: 'Lucía',
    apellido: 'Fernández',
    correo: 'lucia.turismo@turismo.com',
    rol: 'encargado de turismo'
  },
  {
    codigo: 3,
    nombre: 'Marco',
    apellido: 'Rojas',
    correo: 'marco.atracciones@turismo.com',
    rol: 'encargado de atracciones turísticas'
  },
  {
    codigo: 4,
    nombre: 'Ana',
    apellido: 'Salinas',
    correo: 'ana.turista@gmail.com',
    rol: 'turista'
  },
  {
    codigo: 5,
    nombre: 'Pedro',
    apellido: 'Mamani',
    correo: 'pedro.turista@hotmail.com',
    rol: 'turista'
  }
]

export const mookAtraccionesTuristicas: any[] = [
  {
    id: 1,
    categoria: 'Culturales',
    nombre: 'Atraccion Turistica N1',
    descripcion: 'sin descripcion',
    horario_apertura: '08:00 am',
    horario_cierre: '06:00 pm',
    precio: 150,
    estado: true,
    encargado: {
      id: 1,
      nombre_completo: 'Juan Perez'
    }
  }
]

export const mookFotosAtraccionTuristica: any[] = [
  {
    name: 'foto1',
    src: '/images/iglesia-perpetuo-socorro.jpg',
  },
  {
    name: 'foto2',
    src: '/images/photo_turismo.jpg',
  },
  {
    name: 'foto3',
    src: '/images/salon-eventos.jpeg',
  }
]