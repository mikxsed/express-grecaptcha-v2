# express-grecaptcha-v2
> _reCAPTCHA V2 API for Express_

**express-grecaptcha-v2** allows you to easily implement reCAPTCHA validation and rendering into your Express application.

## Usage
```shell
$ yarn add express-grecaptcha-v2
```

> **app.js**
```js
const express = require('express');
const path = require('path');
const recaptcha = require('express-grecaptcha-v2');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(recaptcha({
	testing: process.env.NODE_ENV === 'development',
	secretKey: 'YOUR-SECRET-KEY',
	siteKey: 'YOUR-SITE-KEY'
}));

app.get('/', (request, response) => {
	response.render('index');
});

app.post('/', (request, response, next) => {
	const html = !request.recaptcha.verify()
		? '<p style="color:red;">Verification failed</p>'
		: '<p style="color:green;">Verified successfully</p>';

	response.send(html);
});

app.listen(3000, () => {
	console.log('Listening on http://localhost:3000');
});
```

> **views/index.ejs**
```ejs
<!DOCTYPE html>
<html>
<head>
	<title>ReCaptcha Example</title>
</head>
<body>
	<form method="POST">
		<%- recaptcha.render() %>
		<button type="submit">Submit</button>
	</form>

	<%- recaptcha.script() %>
</body>
</html>
```

## License
**express-grecaptcha-v2** is released under the **MIT License**.
