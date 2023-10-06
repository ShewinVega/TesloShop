import * as Joi from 'joi';



export const JoiValidationSchema = Joi.object({

  DB_USER: Joi.string().required().messages({
    'any.required': `Postgres user conection is required!`,
    'string.base': `Postgres user must be valid text`,
  }),
  DB_PASSWORD: Joi.string().required().messages({
    'any.required': `Password database conection is required!`,
    'string.base': `Password database must be valid text`,
  }),
  DB_NAME: Joi.string().required().messages({
    'any.required': ` Database Name conection is required!`,
    'string.base': `  Database Name must be valid text`,
  }),

  DB_PORT: Joi.number().positive().default(5432).messages({
    'number.base': `Database port must be a number`,
    'number.positive': `Database port must be positive`,
  }),
  DB_HOST: Joi.string().required().messages({
    'any.required': ` Database Name conection is required!`,
    'string.base': `  Database Name must be valid text`,
  }),
  JWT_SECRET: Joi.string().required().messages({
    'any.required': ` JWT secret is required!`,
    'string.base': ` JWT secret must be valid text`,
  }),

});