const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

require('../models/categoria');
require('../models/planes');
require('../models/usuarios');
require('../models/clases');
require('../models/asistencias');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;

		this.authPath = '/api/auth';
		this.usuariosPath = '/api/usuarios';
		this.categoriasPath = '/api/categorias';
		this.clasesPath = '/api/clases';
		this.planesPath = '/api/planes';
		this.pagosPath = '/api/pagos';

		// Conectar con la base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		// Definir rutas
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Parseo de body JSON
		this.app.use(express.json());

		// Carpeta pública
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.usuariosPath, require('../routes/usuarios'));
		this.app.use(this.authPath, require('../routes/auth'));
		this.app.use(this.categoriasPath, require('../routes/categorias'));
		this.app.use(this.planesPath, require('../routes/planes'));
		this.app.use(this.pagosPath, require('../routes/pagos'));
		this.app.use(this.clasesPath, require('../routes/clases'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Servidor corriendo`);
		});
	}
}

module.exports = Server;
