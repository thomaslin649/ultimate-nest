import { capitalize } from "helper-fns";

export const APP_NAME = "nestify";

export const THROTTLE_LIMIT_RESPONSE = "Too many requests, please try again later.";
export const MULTER_IMAGE_FILTER = "Only image files are allowed!.";
export const API_UNAUTHORISED_RESPONSE = "No auth token.";
export const REQUEST_ID_TOKEN_HEADER = "x-request-id";
export const VERSION_VALIDATION_MESSAGE = 'Version must start with "v" followed by a number.';

// swagger constants
export const SWAGGER_TITLE = `${capitalize(APP_NAME)} API Documentation`;

export const SWAGGER_API_ENDPOINT = "doc";
export const SWAGGER_API_CURRENT_VERSION = "1.9.6";
export const SWAGGER_DESCRIPTION = "NestJS + MikroORM blog example with batteries included";

// available values constants
export const SES_REGIONS = [
	"us-east-2",
	"us-east-1",
	"us-west-1",
	"us-west-2",
	"af-south-1",
	"ap-southeast-3",
	"ap-south-1",
	"ap-northeast-3",
	"ap-northeast-2",
	"ap-southeast-1",
	"ap-southeast-2",
	"ap-northeast-1",
	"ca-central-1",
	"eu-central-1",
	"eu-west-1",
	"eu-west-2",
	"eu-south-1",
	"eu-west-3",
	"eu-north-1",
	"me-south-1",
	"sa-east-1",
	"us-gov-west-1",
];
export const APP_ENVIRONMENTS = [
	"dev",
	"development",
	"stage",
	"staging",
	"test",
	"testing",
	"prod",
	"production",
];
