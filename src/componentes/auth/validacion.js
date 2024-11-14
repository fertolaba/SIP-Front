export const formValido = (formData, rol) => {
    const { nombreUsuario, nombre, apellido, edad, generosMusicalesPreferidos, email, confirmEmail, password, aceptarTerminos } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
  
    if (!nombreUsuario) newErrors.nombreUsuario = "El nombre de usuario es obligatorio.";
    if (!nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido) newErrors.apellido = "El apellido es obligatorio.";
    if (!emailRegex.test(email)) newErrors.email = "Por favor ingresa un email válido.";
    if (email !== confirmEmail) newErrors.confirmEmail = "Los correos electrónicos no coinciden.";
    if (!confirmEmail) newErrors.confirmEmail = "Por favor ingresa un email.";
    if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una letra minúscula.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos un número.";
    }
  
    if (!edad || edad < 15 || edad > 99) newErrors.edad = 'Debe tener entre 15 y 100 años';
    if (!formData.localidadId) newErrors.ubicacion = "Debes seleccionar una ubicación.";
  
    if (generosMusicalesPreferidos.length === 0) newErrors.generosMusicalesPreferidos = "Debes seleccionar al menos un interés musical.";
    if (!aceptarTerminos) newErrors.aceptarTerminos = "Debes aceptar los Términos y Condiciones.";
    if (!rol) newErrors.rol = "Debes seleccionar al menos un rol.";
  
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };
  