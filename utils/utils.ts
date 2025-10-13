export function formatoHora12(hora: Date): string {
  const horaFormateada = hora
    .toLocaleTimeString("en-US", {
      hour:"2-digit", 
      minute: "2-digit", 
      hour12: true
    })
    .toLowerCase()
  
  return horaFormateada
}

export function colorEstado(estado: boolean): string {
  return (estado === true) ? "success" : "warn"
}

export function nombreEstado(estado: boolean): string {
  return (estado === true) ? "Activo" : "Inactivo"
}

export function colorEstadoReserva(estado: boolean): string {
  return (estado === true) ? "success" : "warn"
}

export function nombreEstadoReserva(estado: boolean): string {
  return (estado === true) ? "Confirmado" : "Pendiente"
}

export function colorVisible(estado: boolean): string {
  return (estado === true) ? "success" : "warn"
}

export function nombreVisible(estado: boolean): string {
  return (estado === true) ? "Visible" : "Oculto"
}

export function diaSemana(dia : any): string {
  const dias = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[dia];
}
