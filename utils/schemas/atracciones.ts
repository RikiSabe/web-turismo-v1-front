// ~/validators/atraccion-turistica.ts
import { z } from "zod"
import { zodResolver } from "@primevue/forms/resolvers/zod"

export const getSchemaAtraccionStep1 = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

  id_encargado: z.number({
    message: 'Seleccione un encargado para la atracción turística.'
  }).positive({ message: 'Debe seleccionar un encargado válido.' }),

  direccion: z.string()
    .min(5, { message: 'La dirección es requerida y debe tener al menos 5 caracteres.' }),

  departamento: z.number({
    message: 'Seleccione un departamento.'
  }),

  id_ubicacion: z.number({
    message: 'Seleccione una provincia.'
  }).positive({ message: 'Debe seleccionar una provincia válida.' }),

  descripcion: z.string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
})

export const atraccionStep1Resolver = () => zodResolver(getSchemaAtraccionStep1())

export const getSchemaAtraccionStep2 = () => z.object({
  horario_apertura: z.date({
    message: 'Seleccione el horario de apertura.'
  }),

  horario_cierre: z.date({
    message: 'Seleccione el horario de cierre.'
  }),

  precio: z.string()
    .min(1, { message: 'El precio es requerido.' })
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'El precio debe ser un número válido mayor o igual a 0.'
    }),

  categoria: z.number({
    message: 'Seleccione una categoría.'
  }).optional(),

  subcategoria: z.number({
    message: 'Seleccione una subcategoría.'
  }).optional(),
}).refine(data => {
  if (data.horario_apertura && data.horario_cierre) {
    return data.horario_cierre.getTime() > data.horario_apertura.getTime()
  }
  return true
}, {
  message: 'El horario de cierre debe ser posterior al horario de apertura.',
  path: ['horario_cierre']
})

export const atraccionStep2Resolver = () => zodResolver(getSchemaAtraccionStep2())