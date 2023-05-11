const phin = require('phin');

module.exports = function recaptcha(config = {}) {
	if (config.testing) {
		// https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
		config.siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
		config.secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
	}

	if (!config.secretKey || !config.siteKey) {
		throw new Error('secretKey and siteKey are required');
	}

	if (typeof config.enabled === 'undefined') {
		config.enabled = true;
	}

	if (typeof config.verify === 'undefined') {
		config.verify = {};
	}

	if (typeof config.render === 'undefined') {
		config.render = {};
	}

	if (typeof config.script === 'undefined') {
		config.script = {};
	}

	return (request, response, next) => {
		request.recaptcha = {
			verify: (options = {}) => {
				if (!config.enabled) {
					return true;
				}

				if (!options.response) {
					options.response = config.verify.response || 'g-recaptcha-response';
				}

				if (!options.ip) {
					options.ip = config.verify.ip || 'ip';
				}

				if (!request.body[options.response]) {
					return false;
				}

				return phin({
					parse: 'json',
					url: `https://www.google.com/recaptcha/api/siteverify?${new URLSearchParams({
						secret: config.secretKey,
						response: request.body[options.response],
						remoteip: request[options.ip]
					})}`
				}).then((error, response) => !error ? (response.body.success || false) : false);
			}
		};

		response.recaptcha = {
			render: (options = {}) => {
				if (!config.enabled) {
					return '';
				}

				if (!options.class) {
					options.class = config.render.class;
				}

				if (!options.tabindex) {
					options.tabindex = config.render.tabindex;
				}

				if (!options.theme) {
					options.theme = config.render.theme;
				}

				if (!options.size) {
					options.size = config.render.size;
				}

				if (!options.callback) {
					options.callback = config.render.callback;
				}

				if (!options.expiredCallback) {
					options.expiredCallback = config.render.expiredCallback;
				}

				if (!options.errorCallback) {
					options.errorCallback = config.render.errorCallback;
				}

				return `
				<div
					class="g-recaptcha ${typeof options.class !== 'undefined' ? options.class : ''}"
					data-sitekey="${config.siteKey}"
					${typeof options.tabindex !== 'undefined' ? `data-tabindex="${options.tabindex}"` : ''}
					${typeof options.theme !== 'undefined' ? `data-theme="${options.theme}"` : ''}
					${typeof options.size !== 'undefined' ? `data-size="${options.size}"` : ''}
					${typeof options.callback !== 'undefined' ? `data-callback="${options.callback}"` : ''}
					${typeof options.expiredCallback !== 'undefined' ? `data-expired-callback="${options.expiredCallback}"` : ''}
					${typeof options.errorCallback !== 'undefined' ? `data-error-callback="${options.errorCallback}"` : ''}
				></div>`;
			},
			script: (options = {}) => {
				if (!config.enabled) {
					return '';
				}

				if (!options.onload) {
					options.onload = config.script.onload;
				}

				if (!options.render) {
					options.render = config.script.render;
				}

				if (!options.language) {
					options.language = config.script.language;
				}

				let params = '';

				if (options.onload) {
					params += `&onload=${options.onload}`;
				}

				if (options.render) {
					params += `&render=${options.render}`;
				}

				if (options.language) {
					params += `&hl=${options.language}`;
				}

				return `<script src="https://www.google.com/recaptcha/api.js${params != '' ? `?${params}` : ''}" async defer></script>`;
			}
		};

		response.locals.recaptcha = response.recaptcha;

		return next();
	}
}
