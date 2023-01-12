import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenExpiredError } from "jsonwebtoken";
import { I18nService } from "nestjs-i18n";

/**
 *
 * The purpose of this guard is to provide a layer for extracting idx from jwt
 *
 */

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly jwt: JwtService, private readonly i18nService: I18nService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();

		const token = request.headers.authorization;

		if (!token) {
			throw new UnauthorizedException("Token not found in request");
		}

		try {
			const decoded: { idx: string } = this.jwt.verify(token.split(" ")[1]);

			request.idx = decoded.idx;

			return true;
		} catch (error_) {
			const error =
				error_ instanceof TokenExpiredError
					? new UnauthorizedException(
							this.i18nService.t("exception.token", {
								args: { error: "expired" },
							}),
					  )
					: new UnauthorizedException(
							this.i18nService.t("exception.token", {
								args: { error: "malformed" },
							}),
					  );

			throw error;
		}
	}
}
