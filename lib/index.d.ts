interface VerifyOptions {
	/**
	 * Response object name
	 * @default g-recaptcha-response
	 */
	response?: string;
	/**
	 * IP object name
	 * @default ip
	 */
	ip?: string;
}

interface RenderOptions {
	/** ReCaptcha class */
	class?: string;
	/** ReCaptcha tabindex */
	tabindex?: number;
	/** ReCaptcha theme */
	theme?: 'light'|'dark';
	/** ReCaptcha size */
	size?: 'normal'|'compact';
	/** ReCaptcha callback */
	callback?: string;
	/** ReCaptcha expired callback */
	expiredCallback?: string;
	/** ReCaptcha error callback */
	errorCallback?: string;
}

interface ScriptOptions {
	/** Method to call onload */
	onload?: string;
	/** Render method */
	render?: 'onload'|'explicit';
	/** Language code */
	language?: string;
}

interface Config {
	/**
	 * Will not output HTML and verify responses if disabled
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * Will use testing keys if enabled
	 * @default false
	 */
	testing?: boolean;
	/** ReCaptcha site secret */
	secretKey?: string;
	/** ReCaptcha site key */
	siteKey?: string;
	/** Verify options */
	verify?: VerifyOptions;
	/** Render options */
	render?: RenderOptions;
	/** Script options */
	script?: ScriptOptions;
}

declare global {
	namespace Express {
		export interface Request {
			recaptcha: {
				/** Verify the ReCaptcha response */
				verify: (options?: VerifyOptions) => boolean;
			};
		}

		export interface Response {
			recaptcha: {
				/** Render the ReCaptcha box */
				render: (options?: RenderOptions) => string;
				/** Output the ReCaptcha script tag */
				script: (options?: ScriptOptions) => string;
			};
		}
	}
}

declare function recaptcha(config: Config);

export = recaptcha;
