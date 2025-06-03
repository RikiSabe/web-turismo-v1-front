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

interface AtraccionTuristica {
  codigo: number;
  tipo: string;
  nombre: string;
  precio: number;
  horario: string;
  ubicacion: string;
}

export const mookAtraccionesTuristicas: AtraccionTuristica[] = [
  {
    codigo: 1,
    tipo: 'Cultural',
    nombre: 'Casa Dorada',
    precio: 15,
    horario: 'Lunes a Sábado, 9:00 - 17:00',
    ubicacion: 'Calle Sucre esquina Ingavi, centro de Tarija'
  },
  {
    codigo: 2,
    tipo: 'Religiosa',
    nombre: 'Catedral San Bernardo',
    precio: 0,
    horario: 'Todos los días, 7:00 - 20:00',
    ubicacion: 'Plaza Luis de Fuentes y Vargas, Tarija'
  },
  {
    codigo: 3,
    tipo: 'Natural',
    nombre: 'Cañón de los Gatos',
    precio: 25,
    horario: 'Todos los días, 8:00 - 18:00',
    ubicacion: 'Zona de Tomatitas, 20 min del centro de Tarija'
  },
  {
    codigo: 4,
    tipo: 'Cultural',
    nombre: 'Museo Paleontológico de Tarija',
    precio: 20,
    horario: 'Martes a Domingo, 9:00 - 16:00',
    ubicacion: 'Barrio El Molino, calle Suipacha, Tarija'
  },
  {
    codigo: 5,
    tipo: 'Gastronómica',
    nombre: 'Ruta del Vino y Singani',
    precio: 80,
    horario: 'Lunes a Sábado, 10:00 - 18:00',
    ubicacion: 'Valle de la Concepción y alrededores de Tarija'
  },
  {
    codigo: 6,
    tipo: 'Natural',
    nombre: 'Chorros de Jurina',
    precio: 30,
    horario: 'Todos los días, 7:00 - 17:00',
    ubicacion: 'Zona de San Lorenzo, 40 min de Tarija'
  }
]
