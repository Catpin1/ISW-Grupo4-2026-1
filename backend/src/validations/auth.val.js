const Joi = require('joi');

// Validación para el registro de usuario
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Validación para el inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware genérico para validar esquemas
const validateAuth = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  validateRegister: validateAuth(registerSchema),
  validateLogin: validateAuth(loginSchema),
};