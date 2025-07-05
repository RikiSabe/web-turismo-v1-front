export function validarUsuario(values: any) {
  const errors: any = {}

  if (!values.nombre) {
    errors.nombre = [{ message: 'El nombre es requerido.' }]
  } else if (values.nombre.length < 2) {
    errors.nombre = [{ message: 'El nombre debe tener al menos 2 caracteres.' }]
  }

  if (!values.apellido) {
    errors.apellido = [{ message: 'El apellido es requerido.' }]
  } else if (values.apellido.length < 2) {
    errors.apellido = [{ message: 'El apellido debe tener al menos 2 caracteres.' }]
  }

  if (!values.correo) {
    errors.correo = [{ message: 'El correo electrónico es requerido.' }]
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
    errors.correo = [{ message: 'El correo electrónico no es válido.' }]
  }

  if (!values.telefono) {
    errors.telefono = [{ message: 'El teléfono es requerido.' }]
  } else if (!/^\d+$/.test(values.telefono)) {
    errors.telefono = [{ message: 'El teléfono solo debe contener dígitos.' }]
  } else if (values.telefono.length < 7 || values.telefono.length > 15) {
    errors.telefono = [{ message: 'El teléfono debe tener entre 7 y 15 dígitos.' }]
  }

  if (!values.direccion) {
    errors.direccion = [{ message: 'La dirección es requerida.' }]
  } else if (values.direccion.length < 5) {
    errors.direccion = [{ message: 'La dirección debe tener al menos 5 caracteres.' }]
  }

  if (!values.contra) {
    errors.contra = [{ message: 'La contraseña es requerida.' }]
  } else if (values.contra.length < 6) {
    errors.contra = [{ message: 'La contraseña debe tener al menos 6 caracteres.' }]
  }

  return errors
}
