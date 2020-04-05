const express = require('express');
const session = require('express-session');
const app = express();

app.use('/static', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'robotic horse asshole',
		resave: true,
		saveUninitialized: true,
		proxy: true,
		cookie: {
			path: '/',
			secure: false, 
			sameSite : 'none',
			httpOnly: false 
		}
	})
);

app.get('/', async (req, res) => {
  res.end('test');
});


app.listen(8080);
