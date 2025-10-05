// ~/validators/agencia.ts
import { z } from "zod"
import { zodResolver } from "@primevue/forms/resolvers/zod"

export const getAgenciaSchema = () =>
  z.object({
    nombre: z.string()
      .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

    telefono: z.string()
      .regex(/^\d{8}$/, { message: 'El teléfono debe tener exactamente 8 dígitos numéricos.' }),

    correo: z.string()
      .email({ message: 'Ingrese un correo electrónico válido.' }),

    encargado: z.number({
      required_error: 'Seleccione un encargado.',
    }),

    descripcion: z.string()
      .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),

    departamento: z.number({
      required_error: 'Seleccione un departamento.',
    }),

    direccion: z.string()
      .min(5, { message: 'La dirección es requerida y debe tener al menos 5 caracteres.' }),
  })

// exportar un resolver listo para usar
export const agenciaResolver = () => zodResolver(getAgenciaSchema())
