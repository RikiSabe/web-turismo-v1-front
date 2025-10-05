import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

export const getSchemaUsuarioStep1 = () => z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre es requerido y debe tener al menos 3 caracteres.' }),

  apellido_paterno: z.string()
    .min(3, { message: 'El Apellido Paterno es requerido y debe tener al menos 3 caracteres.' }),

  telefono: z.string()
    .regex(/^\d+$/, { message: 'El teléfono debe contener solo números.' })
    .min(8, { message: 'El teléfono debe tener al menos 8 dígitos.' })
    .max(8, { message: 'El teléfono no puede tener más de 8 dígitos.' }),

  departamento: z.number({
    required_error: 'Seleccione un departamento.'
  }),

  provincia: z.number({
    required_error: 'Seleccione una provincia.'
  }),
})

export const usuarioStep1Resolver = () => zodResolver(getSchemaUsuarioStep1())

export const getSchemaUsuarioStep2 = (CorreosUsuarios : { correo : string}[], Roles : string[]) => z.object({
  ci: z.string()
    .regex(/^\d+$/, { message: 'La Cédula de Identidad debe ser numérica.' })
    .min(7, { message: 'La Cédula de Identidad debe tener al menos 7 dígitos.' })
    .max(8, { message: 'La Cédula de Identidad no puede tener más de 8 dígitos.' }),
  
  correo: z.string()
    .email({ message: 'Ingrese un correo electrónico válido.' })
    .refine( value => {
      return !CorreosUsuarios.some( (e : { correo : string }) => e.correo?.toLowerCase() === value.toLowerCase())
    }, { message: 'Correo ya registrado, por favor utilice otro'} ),

  contra: z.string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
 
  rol: z.string()
    .refine(val => Roles.includes(val), { message: 'Seleccione un Rol válido.' }),
})

export const usuarioStep2Resolver = (CorreosUsuarios: { correo: string }[], Roles: string[]) => {
  zodResolver(getSchemaUsuarioStep2(CorreosUsuarios, Roles))
}