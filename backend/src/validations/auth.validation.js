
import Joi from 'joi';
export const authBodyValidation = Joi.object({
    email: Joi.string()
    .email()
    .required()
    .messages({
        "string.empty":"El email no debe estar vacio",
        "any.required":"El email es obligatorio",
        "string.email":"El email debe tener un formato valido"
    }),
    password : Joi.string().
    min(5)
    .max(50)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
        "string.empty":"La contraseña no debe estar vacia",
        "any.required":"La contraseña es obligatoria",
        "string.base": "La contraseña debe ser un texto",
        "string.pattern.base":"La contraseña debe tener solo letras y numeros."
    })

})