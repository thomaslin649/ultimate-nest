import { PaginationRequestAbstract } from "@common/@types";
import { IsStringField, ToBoolean } from "@common/decorators";
import { IsBoolean, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export abstract class PaginationDto implements PaginationRequestAbstract {
	/**
	 *  The search query
	 */
	@IsStringField({ required: false, minLength: 1, maxLength: 100 })
	search: string;

	/** The `withDeleted` property is a boolean flag that
	 * indicates whether to include deleted items in the
	 * results or not.
	 */
	@IsOptional()
	@ToBoolean()
	@IsBoolean({
		message: i18nValidationMessage("validation.isDataType", {
			type: "boolean",
		}),
	})
	withDeleted = false;

	/** The `relations` property is used to specify which related
	 * entities should be included in the query
	 * results.
	 */
	@IsStringField({ required: false, each: true })
	relations = [];

	/** The `fields` property is used to specify which
	 * entities field should be included in the query
	 * results.
	 */
	@IsStringField({ required: false, each: true })
	fields = [];
}
