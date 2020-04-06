const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const app = express();
const fs = require('fs');

const search = require('./search');

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
			sameSite: 'none',
			httpOnly: false
		}
	})
);

app.use(
	upload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
		limits: { fileSize: 50 * 1024 * 1024 },
		debug: false
	})
);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	res.render('index');
});

app.post('/upload', (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	let file = req.files.file;
	let {filepath, subdir} = req.body;
	if (subdir.slice(-1) !== '/') {
		subdir += '/';
	}

	if (filepath.slice(-1) !== '/') {
		filepath += '/';
	}

	let fullpath = `e:/${subdir}${filepath}${file.name}`;
	console.log(fullpath);

	file.mv(`./files/${file.name}`, (err) => {
		if (err) return res.status(500).send(err);

		res.send('File uploaded!');
	});
});

app.get('/api/newFolder', (req, res) => {
	let {path} = req.query;
	fs.exists(path, exists => {
		if (!exists) {
			fs.mkdirSync(path);
			res.json({status: 'ok'});
		} else {
			res.json({status: 'exists'});
		}
	});
})

app.get('/api/search', (req, res) => {
	search.search(req, res);
})

app.listen(8080);
