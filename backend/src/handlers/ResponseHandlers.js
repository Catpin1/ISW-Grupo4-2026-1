export const sendSuccess = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    // Opcional: code: 'AUTH_001' para errores específicos
  });
};