import * as Joi from "joi";

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid("dev", "prod", "stage", "test").required(),
	APP_PORT: Joi.number().required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),
	ENC_KEY: Joi.string().required().length(32),
	JWT_SECRET: Joi.string().required().min(8),
	JWT_REFRESH_EXPIRY: Joi.number().required(),
	JWT_ACCESS_EXPIRY: Joi.string().required(),
	MAIL_USERNAME: Joi.string().required(),
	MAIL_PASSWORD: Joi.string().required(),
	MAIL_HOST: Joi.string().required(),
	MAIL_PORT: Joi.number().required(),
	MAIL_PREVIEW_EMAIL: Joi.boolean().default(false).required(),
	MAIL_TEMPLATE_DIR: Joi.string().required(),
	REDIS_URL: Joi.string().required(),
	// SENTRY_DSN: Joi.string().required(),
	// MINIO_HOST: Joi.string().required(),
	// MINIO_PORT: Joi.number().required(),
	// MINIO_ACCESS_KEY: Joi.string().required(),
	// MINIO_SECRET_KEY: Joi.string().required(),
	// MINIO_USE_SSL: Joi.boolean().required(),
});
