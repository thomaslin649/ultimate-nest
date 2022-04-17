import { Inject, Injectable, Logger } from "@nestjs/common";
import * as eta from "eta";
import { createTransport, SendMailOptions } from "nodemailer";
import previewEmail from "preview-email";
import { MAIL_MODULE_OPTIONS } from "./mailer.constants";
import { MailModuleOptions } from "./mailer.options";

interface IMailOptions extends Partial<SendMailOptions> {
	template: string;
	replacements: Record<string, any>;
}

@Injectable()
export class MailerService {
	constructor(
		@Inject(MAIL_MODULE_OPTIONS)
		private readonly options: MailModuleOptions,
	) {}

	private readonly logger: Logger = new Logger(MailerService.name);

	sendMail(mailOptions: IMailOptions) {
		const transporter = createTransport({
			host: this.options.host,
			port: this.options.port,
			secure: true,
			auth: {
				user: this.options.username,
				pass: this.options.password,
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false,
			},
		});

		return new Promise<boolean>((resolve, reject) =>
			eta.renderFile(
				`${__dirname}/../../${this.options.template.dir}/${mailOptions.template}.eta`,
				mailOptions.replacements,
				this.options.template.etaOptions,
				(error, html) => {
					if (error) {
						reject(error);
					}

					mailOptions.html = html;

					if (this.options.previewEmail) {
						previewEmail(mailOptions)
							.then(console.info)
							.catch(console.error);
					}

					transporter.sendMail(mailOptions, async (error, info) => {
						if (error) {
							this.logger.error("error is " + error);
							reject(false);
						} else {
							this.logger.debug(
								"info",
								"Email sent: " + info.response,
							);
							resolve(true);
						}
					});
				},
			),
		);
	}
}
