const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const app = express();
const fs = require('fs');
const AmdZip = require('adm-zip');
require('dotenv').config();

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
		limits: { fileSize: 50 * 1024 * 1024 * 1024 },
		debug: false
	})
);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	if (req.session.loggedIn) {
		res.render('index');
	} else {
		res.render('login');
	}
});

app.post('/', (req, res) => {
	const {username, password} = req.body;
	const {UNAME: correctUsername, PWORD: correctPassword} = process.env;

	if (username === correctUsername && password === correctPassword) {
		req.session.loggedIn = true;
	}

	res.writeHead(302, {
		'Location': '/'
	})
	res.end();
})

app.post('/api/signout', (req, res) => {
	req.session.loggedIn = false;
	res.writeHead(302, {
		'Location': '/'
	})
	res.end()
})

app.post('/api/upload', (req, res) => {
	if (!req.session.loggedIn) {
		res.writeHead(302, {
			'Location': '/'
		})
		res.end();
		return;
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	let file = req.files.file;
	let {filepath, subdir} = req.body;

	if (subdir.length === 0) {
		subdir = 'Videos';
	}

	if (subdir.slice(-1) !== '/') {
		subdir += '/';
	}

	if (filepath.slice(-1) !== '/') {
		filepath += '/';
	}

	let partpath = `e:/${subdir}${filepath}`;
	let fullpath = `${partpath}${file.name}`;
	
	console.log(`Attempting to upload ${file.name} to ${fullpath}...`);

	fs.exists(fullpath, exists => {
		if (!exists) {
			file.mv(fullpath, (err) => {
				if (err) return res.status(500).send(err);
				console.log('File uploaded!');
				res.send('File uploaded!');

				if (fullpath.slice(-4) === '.zip') {
					let zip = new AmdZip(fullpath);
					zip.extractAllTo(partpath, false);
					fs.unlinkSync(fullpath);
				}

			});
		} else {
			res.send('Error');
			console.log('This file already exists!');
		}
	})
});

app.get('/api/newFolder', (req, res) => {
	if (!req.session.loggedIn) {
		res.writeHead(302, {
			'Location': '/'
		})
		res.end();
		return;
	}
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
	if (!req.session.loggedIn) {
		res.writeHead(302, {
			'Location': '/'
		})
		res.end();
		return;
	}
	search.search(req, res);
})

app.listen(8082);
